package com.skillbridge.auth.service;

import com.skillbridge.auth.dto.*;
import com.skillbridge.common.exception.BadRequestException;
import com.skillbridge.common.exception.ResourceNotFoundException;
import com.skillbridge.common.model.StudentProfile;
import com.skillbridge.common.model.User;
import com.skillbridge.common.repository.StudentProfileRepository;
import com.skillbridge.common.repository.UserRepository;
import com.skillbridge.common.security.JwtTokenProvider;
import com.skillbridge.common.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, StudentProfileRepository studentProfileRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_STUDENT")
                .build();

        user = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .targetRoleId("backend-developer")
                .targetRoleTitle("Backend Developer")
                .build();
        studentProfileRepository.save(profile);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .targetRole(profile.getTargetRoleTitle())
                .build();

        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .token(token)
                .user(userDto)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);

        UserDto userDto = UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .targetRole(profile != null ? profile.getTargetRoleTitle() : "Backend Developer")
                .build();

        return AuthResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .token(token)
                .user(userDto)
                .build();
    }

    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId()).orElse(null);

        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .targetRole(profile != null ? profile.getTargetRoleTitle() : "Backend Developer")
                .build();
    }

    public AuthResponse refreshToken(String oldToken) {
        if (oldToken != null && oldToken.startsWith("Bearer ")) {
            oldToken = oldToken.substring(7);
        }

        if (oldToken != null && tokenProvider.validateToken(oldToken)) {
            Long userId = tokenProvider.getUserIdFromJWT(oldToken);
            String email = tokenProvider.getEmailFromJWT(oldToken);

            String newToken = tokenProvider.generateToken(email, userId);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            return AuthResponse.builder()
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .token(newToken)
                    .build();
        }

        throw new BadRequestException("Invalid or expired token for refresh");
    }
}
