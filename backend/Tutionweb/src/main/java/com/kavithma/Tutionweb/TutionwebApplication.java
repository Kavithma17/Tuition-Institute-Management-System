package com.kavithma.Tutionweb;


import com.kavithma.Tutionweb.model.Student;


import com.kavithma.Tutionweb.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TutionwebApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(TutionwebApplication.class, args);
	}

    @Autowired
	private StudentRepository studentRepository;
	

	@Override
	public void run(String... args) throws Exception {

		Student student1= new Student();
		student1.setName("Kavithma");
		student1.setEmail("Kavi@gmail.com");
		student1.setPassword("1234");
		studentRepository.save(student1);





	}
}
