package com.skillbridge.assessment.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AssessmentSubmissionRequest {
    private Map<Long, Integer> answers = new HashMap<>();

    public AssessmentSubmissionRequest() {}

    public AssessmentSubmissionRequest(Map<Long, Integer> answers) {
        this.answers = answers;
    }

    public Map<Long, Integer> getAnswers() { return answers; }

    @JsonSetter("answers")
    public void setAnswersObj(Object answersObj) {
        if (answersObj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) answersObj;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                try {
                    Long key = Long.parseLong(entry.getKey().toString());
                    Integer val = Integer.parseInt(entry.getValue().toString());
                    this.answers.put(key, val);
                } catch (Exception ignored) {}
            }
        } else if (answersObj instanceof List) {
            List<?> list = (List<?>) answersObj;
            for (Object item : list) {
                if (item instanceof Map) {
                    Map<?, ?> itemMap = (Map<?, ?>) item;
                    Object qId = itemMap.containsKey("questionId") ? itemMap.get("questionId") : itemMap.get("id");
                    Object optIdx = itemMap.containsKey("selectedOptionIndex") ? itemMap.get("selectedOptionIndex") : itemMap.get("optionIndex");
                    if (qId != null && optIdx != null) {
                        try {
                            this.answers.put(Long.parseLong(qId.toString()), Integer.parseInt(optIdx.toString()));
                        } catch (Exception ignored) {}
                    }
                }
            }
        }
    }
}
