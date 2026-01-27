package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.exception.ResourceNotFound;
import com.kavithma.Tutionweb.model.Teacher;
import com.kavithma.Tutionweb.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/teachers")
@RestController

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174"})

public class TeacherController {

    @Autowired
    private TeacherRepository teacherRepository;

    //find users
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
     //add user
    @PostMapping
    public Teacher createTeacher(@RequestBody Teacher teacher)
    {
        return  teacherRepository.save(teacher);
    }
    //call by id
   @GetMapping("{id}")
    public ResponseEntity<Teacher> getTeacherbyId(@PathVariable long id)
    {
         Teacher teacher = teacherRepository.findById(id).
                 orElseThrow(() -> new ResourceNotFound("Not a Teacher by that id"));

         return ResponseEntity.ok(teacher);
    }

    //update user
    @PutMapping("{id}")
    public ResponseEntity<Teacher> updateTeacher (@PathVariable long id , @RequestBody Teacher teacherdetails)
    {
           Teacher updateteacher = teacherRepository.findById(id).
                   orElseThrow(()-> new ResourceNotFound("Teacher not exist in that id"+ id));
           updateteacher.setName(teacherdetails.getName());
           updateteacher.setQualification(teacherdetails.getQualification());
           updateteacher.setSubject(teacherdetails.getSubject());
           updateteacher.setPhotoUrl(teacherdetails.getPhotoUrl());
           teacherRepository.save(updateteacher);
            return  ResponseEntity.ok(updateteacher);
    }

    //delete user
    @DeleteMapping("{id}")
    public ResponseEntity<HttpStatus> deleteteacher(@PathVariable long id)
    {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFound("Teacher not exist in that id"+id));

        teacherRepository.delete(teacher);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
