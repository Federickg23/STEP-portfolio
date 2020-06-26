package com.google.sps.data;

/** An item on a comment list. */
public final class Comment {

  private final long id;
  private final String message;
  private final long timestamp;

  public Comment(long id, String message, long timestamp) {
    this.id = id;
    this.message = message;
    this.timestamp = timestamp;
  }
}
