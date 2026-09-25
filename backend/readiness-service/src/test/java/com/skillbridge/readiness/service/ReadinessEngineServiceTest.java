package com.skillbridge.readiness.service;

import com.skillbridge.common.model.*;
import com.skillbridge.common.model.enums.SkillStatus;
import com.skillbridge.common.repository.*;
import com.skillbridge.readiness.dto.CareerReadinessDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReadinessEngineServiceTest {

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private CareerRoleRepository careerRoleRepository;

    @Mock
    private CareerCompetencyRepository careerCompetencyRepository;

    @Mock
    private StudentSkillRepository studentSkillRepository;

    @Mock
    private AssessmentRepository assessmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ReadinessEngineService readinessEngineService;

    @Test
    void testCalculateReadinessCoverage() {
        Long userId = 1L;
        String roleId = "backend-developer";

        CareerRole role = CareerRole.builder().roleId(roleId).title("Backend Developer").build();
        when(careerRoleRepository.findByRoleId(roleId)).thenReturn(Optional.of(role));

        CareerCompetency c1 = CareerCompetency.builder().roleId(roleId).skillId("java").skillName("Java").importanceWeight(1.0).build();
        CareerCompetency c2 = CareerCompetency.builder().roleId(roleId).skillId("docker").skillName("Docker").importanceWeight(1.0).build();
        when(careerCompetencyRepository.findByRoleId(roleId)).thenReturn(Arrays.asList(c1, c2));

        StudentSkill s1 = StudentSkill.builder().userId(userId).skillId("java").name("Java").status(SkillStatus.VERIFIED).build();
        StudentSkill s2 = StudentSkill.builder().userId(userId).skillId("docker").name("Docker").status(SkillStatus.MISSING).build();
        when(studentSkillRepository.findByUserId(userId)).thenReturn(Arrays.asList(s1, s2));

        when(courseRepository.findAll()).thenReturn(Collections.emptyList());
        when(projectRepository.findAll()).thenReturn(Collections.emptyList());

        CareerReadinessDto dto = readinessEngineService.calculateReadiness(userId, roleId);

        assertNotNull(dto);
        assertEquals(50, dto.getCompetencyCoveragePercentage());
        assertEquals(1, dto.getVerifiedSkills().size());
        assertEquals(1, dto.getMissingSkills().size());
        assertNotNull(dto.getNextBestAction());
    }
}
