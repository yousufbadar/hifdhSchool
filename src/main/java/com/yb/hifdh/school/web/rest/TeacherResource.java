package com.yb.hifdh.school.web.rest;

import com.yb.hifdh.school.domain.Teacher;
import com.yb.hifdh.school.repository.TeacherRepository;
import com.yb.hifdh.school.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.yb.hifdh.school.domain.Teacher}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TeacherResource {

    private final Logger log = LoggerFactory.getLogger(TeacherResource.class);

    private static final String ENTITY_NAME = "teacher";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeacherRepository teacherRepository;

    public TeacherResource(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    /**
     * {@code POST  /teachers} : Create a new teacher.
     *
     * @param teacher the teacher to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teacher, or with status {@code 400 (Bad Request)} if the teacher has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teachers")
    public ResponseEntity<Teacher> createTeacher(@Valid @RequestBody Teacher teacher) throws URISyntaxException {
        log.debug("REST request to save Teacher : {}", teacher);
        if (teacher.getId() != null) {
            throw new BadRequestAlertException("A new teacher cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Teacher result = teacherRepository.save(teacher);
        return ResponseEntity
            .created(new URI("/api/teachers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teachers/:id} : Updates an existing teacher.
     *
     * @param id the id of the teacher to save.
     * @param teacher the teacher to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teacher,
     * or with status {@code 400 (Bad Request)} if the teacher is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teacher couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teachers/{id}")
    public ResponseEntity<Teacher> updateTeacher(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Teacher teacher
    ) throws URISyntaxException {
        log.debug("REST request to update Teacher : {}, {}", id, teacher);
        if (teacher.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teacher.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teacherRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Teacher result = teacherRepository.save(teacher);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, teacher.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /teachers/:id} : Partial updates given fields of an existing teacher, field will ignore if it is null
     *
     * @param id the id of the teacher to save.
     * @param teacher the teacher to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teacher,
     * or with status {@code 400 (Bad Request)} if the teacher is not valid,
     * or with status {@code 404 (Not Found)} if the teacher is not found,
     * or with status {@code 500 (Internal Server Error)} if the teacher couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teachers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Teacher> partialUpdateTeacher(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Teacher teacher
    ) throws URISyntaxException {
        log.debug("REST request to partial update Teacher partially : {}, {}", id, teacher);
        if (teacher.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teacher.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teacherRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Teacher> result = teacherRepository
            .findById(teacher.getId())
            .map(existingTeacher -> {
                if (teacher.getFirstName() != null) {
                    existingTeacher.setFirstName(teacher.getFirstName());
                }
                if (teacher.getMiddleName() != null) {
                    existingTeacher.setMiddleName(teacher.getMiddleName());
                }
                if (teacher.getLastName() != null) {
                    existingTeacher.setLastName(teacher.getLastName());
                }
                if (teacher.getLikeToBeCalled() != null) {
                    existingTeacher.setLikeToBeCalled(teacher.getLikeToBeCalled());
                }
                if (teacher.getBirthDate() != null) {
                    existingTeacher.setBirthDate(teacher.getBirthDate());
                }
                if (teacher.getPhoto() != null) {
                    existingTeacher.setPhoto(teacher.getPhoto());
                }
                if (teacher.getPhotoContentType() != null) {
                    existingTeacher.setPhotoContentType(teacher.getPhotoContentType());
                }
                if (teacher.getCellPhone() != null) {
                    existingTeacher.setCellPhone(teacher.getCellPhone());
                }
                if (teacher.getHomePhone() != null) {
                    existingTeacher.setHomePhone(teacher.getHomePhone());
                }
                if (teacher.getEmail() != null) {
                    existingTeacher.setEmail(teacher.getEmail());
                }
                if (teacher.getStreet() != null) {
                    existingTeacher.setStreet(teacher.getStreet());
                }
                if (teacher.getCity() != null) {
                    existingTeacher.setCity(teacher.getCity());
                }
                if (teacher.getState() != null) {
                    existingTeacher.setState(teacher.getState());
                }
                if (teacher.getZip() != null) {
                    existingTeacher.setZip(teacher.getZip());
                }

                return existingTeacher;
            })
            .map(teacherRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, teacher.getId().toString())
        );
    }

    /**
     * {@code GET  /teachers} : get all the teachers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teachers in body.
     */
    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Teachers");
        Page<Teacher> page = teacherRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /teachers/:id} : get the "id" teacher.
     *
     * @param id the id of the teacher to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teacher, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teachers/{id}")
    public ResponseEntity<Teacher> getTeacher(@PathVariable Long id) {
        log.debug("REST request to get Teacher : {}", id);
        Optional<Teacher> teacher = teacherRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(teacher);
    }

    /**
     * {@code DELETE  /teachers/:id} : delete the "id" teacher.
     *
     * @param id the id of the teacher to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        log.debug("REST request to delete Teacher : {}", id);
        teacherRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
