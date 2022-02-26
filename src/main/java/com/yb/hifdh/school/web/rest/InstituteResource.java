package com.yb.hifdh.school.web.rest;

import com.yb.hifdh.school.domain.Institute;
import com.yb.hifdh.school.repository.InstituteRepository;
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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.yb.hifdh.school.domain.Institute}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InstituteResource {

    private final Logger log = LoggerFactory.getLogger(InstituteResource.class);

    private static final String ENTITY_NAME = "institute";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InstituteRepository instituteRepository;

    public InstituteResource(InstituteRepository instituteRepository) {
        this.instituteRepository = instituteRepository;
    }

    /**
     * {@code POST  /institutes} : Create a new institute.
     *
     * @param institute the institute to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new institute, or with status {@code 400 (Bad Request)} if the institute has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/institutes")
    public ResponseEntity<Institute> createInstitute(@Valid @RequestBody Institute institute) throws URISyntaxException {
        log.debug("REST request to save Institute : {}", institute);
        if (institute.getId() != null) {
            throw new BadRequestAlertException("A new institute cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Institute result = instituteRepository.save(institute);
        return ResponseEntity
            .created(new URI("/api/institutes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /institutes/:id} : Updates an existing institute.
     *
     * @param id the id of the institute to save.
     * @param institute the institute to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated institute,
     * or with status {@code 400 (Bad Request)} if the institute is not valid,
     * or with status {@code 500 (Internal Server Error)} if the institute couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/institutes/{id}")
    public ResponseEntity<Institute> updateInstitute(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Institute institute
    ) throws URISyntaxException {
        log.debug("REST request to update Institute : {}, {}", id, institute);
        if (institute.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, institute.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!instituteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Institute result = instituteRepository.save(institute);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, institute.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /institutes/:id} : Partial updates given fields of an existing institute, field will ignore if it is null
     *
     * @param id the id of the institute to save.
     * @param institute the institute to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated institute,
     * or with status {@code 400 (Bad Request)} if the institute is not valid,
     * or with status {@code 404 (Not Found)} if the institute is not found,
     * or with status {@code 500 (Internal Server Error)} if the institute couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/institutes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Institute> partialUpdateInstitute(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Institute institute
    ) throws URISyntaxException {
        log.debug("REST request to partial update Institute partially : {}, {}", id, institute);
        if (institute.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, institute.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!instituteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Institute> result = instituteRepository
            .findById(institute.getId())
            .map(existingInstitute -> {
                if (institute.getName() != null) {
                    existingInstitute.setName(institute.getName());
                }
                if (institute.getPhone() != null) {
                    existingInstitute.setPhone(institute.getPhone());
                }
                if (institute.getWebsite() != null) {
                    existingInstitute.setWebsite(institute.getWebsite());
                }
                if (institute.getEmail() != null) {
                    existingInstitute.setEmail(institute.getEmail());
                }
                if (institute.getStreet() != null) {
                    existingInstitute.setStreet(institute.getStreet());
                }
                if (institute.getCity() != null) {
                    existingInstitute.setCity(institute.getCity());
                }
                if (institute.getState() != null) {
                    existingInstitute.setState(institute.getState());
                }
                if (institute.getZip() != null) {
                    existingInstitute.setZip(institute.getZip());
                }

                return existingInstitute;
            })
            .map(instituteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, institute.getId().toString())
        );
    }

    /**
     * {@code GET  /institutes} : get all the institutes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of institutes in body.
     */
    @GetMapping("/institutes")
    public List<Institute> getAllInstitutes() {
        log.debug("REST request to get all Institutes");
        return instituteRepository.findAll();
    }

    /**
     * {@code GET  /institutes/:id} : get the "id" institute.
     *
     * @param id the id of the institute to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the institute, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/institutes/{id}")
    public ResponseEntity<Institute> getInstitute(@PathVariable Long id) {
        log.debug("REST request to get Institute : {}", id);
        Optional<Institute> institute = instituteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(institute);
    }

    /**
     * {@code DELETE  /institutes/:id} : delete the "id" institute.
     *
     * @param id the id of the institute to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/institutes/{id}")
    public ResponseEntity<Void> deleteInstitute(@PathVariable Long id) {
        log.debug("REST request to delete Institute : {}", id);
        instituteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
