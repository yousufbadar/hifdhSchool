package com.yb.hifdh.school.web.rest;

import com.yb.hifdh.school.domain.Tracker;
import com.yb.hifdh.school.repository.TrackerRepository;
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
 * REST controller for managing {@link com.yb.hifdh.school.domain.Tracker}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TrackerResource {

    private final Logger log = LoggerFactory.getLogger(TrackerResource.class);

    private static final String ENTITY_NAME = "tracker";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TrackerRepository trackerRepository;

    public TrackerResource(TrackerRepository trackerRepository) {
        this.trackerRepository = trackerRepository;
    }

    /**
     * {@code POST  /trackers} : Create a new tracker.
     *
     * @param tracker the tracker to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tracker, or with status {@code 400 (Bad Request)} if the tracker has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trackers")
    public ResponseEntity<Tracker> createTracker(@Valid @RequestBody Tracker tracker) throws URISyntaxException {
        log.debug("REST request to save Tracker : {}", tracker);
        if (tracker.getId() != null) {
            throw new BadRequestAlertException("A new tracker cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tracker result = trackerRepository.save(tracker);
        return ResponseEntity
            .created(new URI("/api/trackers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trackers/:id} : Updates an existing tracker.
     *
     * @param id the id of the tracker to save.
     * @param tracker the tracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tracker,
     * or with status {@code 400 (Bad Request)} if the tracker is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trackers/{id}")
    public ResponseEntity<Tracker> updateTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Tracker tracker
    ) throws URISyntaxException {
        log.debug("REST request to update Tracker : {}, {}", id, tracker);
        if (tracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tracker result = trackerRepository.save(tracker);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tracker.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trackers/:id} : Partial updates given fields of an existing tracker, field will ignore if it is null
     *
     * @param id the id of the tracker to save.
     * @param tracker the tracker to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tracker,
     * or with status {@code 400 (Bad Request)} if the tracker is not valid,
     * or with status {@code 404 (Not Found)} if the tracker is not found,
     * or with status {@code 500 (Internal Server Error)} if the tracker couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trackers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tracker> partialUpdateTracker(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Tracker tracker
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tracker partially : {}, {}", id, tracker);
        if (tracker.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tracker.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trackerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tracker> result = trackerRepository
            .findById(tracker.getId())
            .map(existingTracker -> {
                if (tracker.getPage() != null) {
                    existingTracker.setPage(tracker.getPage());
                }
                if (tracker.getWord() != null) {
                    existingTracker.setWord(tracker.getWord());
                }
                if (tracker.getRecall() != null) {
                    existingTracker.setRecall(tracker.getRecall());
                }
                if (tracker.getConnect() != null) {
                    existingTracker.setConnect(tracker.getConnect());
                }
                if (tracker.getTajweed() != null) {
                    existingTracker.setTajweed(tracker.getTajweed());
                }
                if (tracker.getMakhraj() != null) {
                    existingTracker.setMakhraj(tracker.getMakhraj());
                }
                if (tracker.getCreateTimestamp() != null) {
                    existingTracker.setCreateTimestamp(tracker.getCreateTimestamp());
                }

                return existingTracker;
            })
            .map(trackerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tracker.getId().toString())
        );
    }

    /**
     * {@code GET  /trackers} : get all the trackers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trackers in body.
     */
    @GetMapping("/trackers")
    public ResponseEntity<List<Tracker>> getAllTrackers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Trackers");
        Page<Tracker> page = trackerRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /trackers/:id} : get the "id" tracker.
     *
     * @param id the id of the tracker to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tracker, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trackers/{id}")
    public ResponseEntity<Tracker> getTracker(@PathVariable Long id) {
        log.debug("REST request to get Tracker : {}", id);
        Optional<Tracker> tracker = trackerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tracker);
    }

    /**
     * {@code DELETE  /trackers/:id} : delete the "id" tracker.
     *
     * @param id the id of the tracker to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trackers/{id}")
    public ResponseEntity<Void> deleteTracker(@PathVariable Long id) {
        log.debug("REST request to delete Tracker : {}", id);
        trackerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
