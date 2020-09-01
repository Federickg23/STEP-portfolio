// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.sps.data.Comment;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {
  private List<String> messages;
  private int amt;
  @Override
  public void init() {
    messages = new ArrayList<>();
  }



  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    //System.out.println(request.getParameter("amt"));
    //Integer.parseInt(request.getParameter("amt"));
    //Hardcoded amount to see if it was the amount giving an error, turns out it isn't 
    System.out.print(request.getParameter("max-comments")); 
    amt = Integer.parseInt(request.getParameter("max-comments"));
    System.out.println("Amount in get method: " + amt);
    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      long id = entity.getKey().getId();
      String message = (String) entity.getProperty("message");
      long timestamp = (long) entity.getProperty("timestamp");

      Comment comment = new Comment(id, message, timestamp);
      comments.add(comment);
    }
    System.out.println("Comments array size: ");
    System.out.println(comments.size());
    while (comments.size() > amt){
      comments.remove(comments.size() - 1);
    }
    Gson gson = new Gson();

    response.setContentType("application/json;");
    String returnVal = gson.toJson(comments);
    //System.out.println("{\"message\": 13}")
    //At this point, json seems to be fine, but then i get an error in the console. 
    //response.getWriter().println(gson.toJson(comments)); 
    response.getWriter().println(returnVal);
    //response.sendRedirect("/profiles.html");
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the input from the form.
    String text = "";
    text = request.getParameter("comment");
    try {
        System.out.print(request.getParameter("max-comments")); 
        amt = Integer.parseInt(request.getParameter("max-comments"));
    } catch (Exception e) {
        System.out.println(e);
    }
    if (text != null && !text.isEmpty()){
        messages.add(text);
        long timestamp = System.currentTimeMillis();

        Entity commentEntity = new Entity("Comment");
        commentEntity.setProperty("message", text);
        commentEntity.setProperty("timestamp", timestamp);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(commentEntity);
    }
    response.sendRedirect("/profiles.html");
  }
}
