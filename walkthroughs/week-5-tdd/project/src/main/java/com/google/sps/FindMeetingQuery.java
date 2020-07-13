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

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.HashSet;
import java.util.HashMap;
import java.util.Map;


public final class FindMeetingQuery {
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        Collection<TimeRange> validRanges = new ArrayList<>();
    
        long meetingDuration = request.getDuration();

        //Requests shouldn't last longer than a day, so no valid times if the meeting is
        //set as lnoger than a day 
        if(meetingDuration > TimeRange.WHOLE_DAY.duration()){
            return validRanges;
        }
    
        Collection<TimeRange> conflicts = getConflicts(events, request);
        Collections.sort((ArrayList) conflicts, TimeRange.ORDER_BY_START); 

        validRanges = getValidRanges(conflicts, meetingDuration);

        if (!request.getOptionalAttendees().isEmpty()){
             if(validRanges.contains(TimeRange.WHOLE_DAY)){
                
                validRanges = getValidRanges(getOptionalConflicts(events, request), meetingDuration); 
             }
             else{
                validRanges = getOptionalValidRanges(events, validRanges, request);
             }
        }
        //throw new UnsupportedOperationException("TODO: Implement this method.");
        return validRanges;
    }

    private Collection<TimeRange> getOptionalValidRanges(Collection<Event> events, Collection <TimeRange> validRanges, MeetingRequest request){
        Collection<TimeRange> conflictingOptionalRanges = getOptionalConflicts(events, request); 
        Collection<TimeRange> validOptionalRanges = new ArrayList<>(); 
        

        for(TimeRange validRange : validRanges){
            boolean valid = true; 
            for(TimeRange invalidRange: conflictingOptionalRanges){
                if(validRange.overlaps(invalidRange) || validRange.contains(invalidRange) || invalidRange.contains(validRange)){
                    valid = false;
                }
            }
            if(valid){
                validOptionalRanges.add(validRange);
            }    
        }

        //If the optional attendee has no free time, then resume as originally planned
        if(validOptionalRanges.isEmpty()){
            return validRanges;
        }

        return validOptionalRanges;



    }
    
    private Collection<TimeRange> getValidRanges(Collection<TimeRange> conflicts, long meetingDuration){
        
        Collection<TimeRange> potentialTimes = new ArrayList<>();
        
        int start = TimeRange.START_OF_DAY;
        int end = TimeRange.START_OF_DAY; 

        TimeRange oldRange = TimeRange.fromStartEnd(start, end, false); 
        
        
        for(  TimeRange range: conflicts){
            if(oldRange.contains(range)){
                oldRange = range; 
            }
            else if(oldRange.overlaps(range)){
                start = range.end(); 
                end = range.end();
            }
            else { 
                end = range.start();
                TimeRange possibleRange = TimeRange.fromStartEnd(start, end, false); 
                if (possibleRange.duration() >= meetingDuration){
                    potentialTimes.add(possibleRange); 
                }
                start = range.end();
                oldRange = range;
            }

        }
        
        TimeRange finalTime = TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true);
        if( finalTime.duration() >= meetingDuration){
            potentialTimes.add(finalTime);
        }
        
        return potentialTimes;
        
    }


    private Collection<TimeRange> getConflicts(Collection<Event> events, MeetingRequest request){
        Collection<TimeRange> conflicts = new ArrayList<>(); 
        Collection<String> attendees = new ArrayList<String>(request.getAttendees());

        for (Event event: events){
            TimeRange eventTime = event.getWhen();
            Set<String> busyAttendees = new HashSet<String>(event.getAttendees());
            
            for ( String attendee : attendees ) {
                if(busyAttendees.contains(attendee)){
                    conflicts.add(eventTime);
                    break;
                
                }
            }
        }

        return conflicts; 
    }

 
    private Collection<TimeRange> getOptionalConflicts(Collection<Event> events, MeetingRequest request){
        Collection<TimeRange> conflicts = new ArrayList<>(); 
        Collection<String> attendees = new ArrayList<String>(request.getOptionalAttendees());
        int numAttendees = attendees.size();
        
        //Gets the times that conflict with a majority of optional attendees, so that there are more time frames for the meeting. 
        for (Event event: events){
            TimeRange eventTime = event.getWhen();
            Set<String> busyAttendees = new HashSet<String>(event.getAttendees());   
            int busy = 0;
            for ( String attendee : attendees ) {
                if(busyAttendees.contains(attendee)){
                    busy +=1; 
                    if(busy >= numAttendees/3){
                        conflicts.add(eventTime);
                        break;
                    }
                
                }
            }
        }
        return conflicts; 
    }

       

}

