package com.skillsharing.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillsharing.dto.PostRequestDTO;
import com.skillsharing.dto.SharePostDTO;
import com.skillsharing.model.Notification;
import com.skillsharing.model.Post;
import com.skillsharing.model.User;
import com.skillsharing.repository.NotificationRepository;
import com.skillsharing.repository.PostRepository;
import com.skillsharing.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequestDTO request) {
        logger.info("Creating post with content: {}", request.getContent());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = Post.builder()
            .authorId(currentUser.getId())
            .authorUsername(currentUser.getUsername())
            .authorFirstName(currentUser.getFirstName())
            .authorLastName(currentUser.getLastName())
            .authorProfilePicture(currentUser.getProfilePicture())
            .content(request.getContent())
            .mediaUrl(request.getMediaUrl())
            .mediaType(request.getMediaType())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        
        Post savedPost = postRepository.save(post);
        logger.info("Post created: {}", savedPost.getId());
        
        return ResponseEntity.ok(savedPost);
    }
    
    @GetMapping
    public ResponseEntity<List<Post>> getFeedPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get posts from users that current user follows, plus their own posts
        Set<String> followingIds = new HashSet<>(currentUser.getFollowing());
        followingIds.add(currentUser.getId()); // Include own posts
        
        List<Post> posts = postRepository.findByAuthorIdIn(
            new ArrayList<>(followingIds),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable String userId) {
        logger.info("Fetching posts for user: {}", userId);
        List<Post> posts = postRepository.findByAuthorId(
            userId,
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            logger.error("Error fetching post by ID: {}", postId, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/detail/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        try {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            logger.error("Error fetching post by ID: {}", postId, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User currentUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Check if current user is the author of the post
        if (!post.getAuthorId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this post");
        }
        
        // Delete any share posts if this is an original post
        if (post.getOriginalPostId() == null) {
            // This is an original post - find and delete all shares of this post
            List<Post> sharedPosts = postRepository.findByOriginalPostId(postId);
            if (!sharedPosts.isEmpty()) {
                postRepository.deleteAll(sharedPosts);
                logger.info("Deleted {} shared posts for original post: {}", sharedPosts.size(), postId);
            }
        }
        
        // Delete the post itself
        postRepository.delete(post);
        logger.info("Post deleted: {}", postId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Post deleted successfully");
        return ResponseEntity.ok(response);
    }
    
}
