package com.kavithma.Tutionweb.controller;

import com.kavithma.Tutionweb.model.Student;
import com.kavithma.Tutionweb.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
@RequestMapping("/api/students")
@RestController
public class StudentController {

 @Autowired
     private StudentRepository studentRepository;
   @GetMapping
     public List<Student> getallstudents()
     {
         return studentRepository.findAll();
     }
}
