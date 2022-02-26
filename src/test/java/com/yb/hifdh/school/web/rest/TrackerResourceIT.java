package com.yb.hifdh.school.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.yb.hifdh.school.IntegrationTest;
import com.yb.hifdh.school.domain.Tracker;
import com.yb.hifdh.school.repository.TrackerRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TrackerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TrackerResourceIT {

    private static final Integer DEFAULT_PAGE = 1;
    private static final Integer UPDATED_PAGE = 2;

    private static final Integer DEFAULT_WORD = 1;
    private static final Integer UPDATED_WORD = 2;

    private static final Boolean DEFAULT_RECALL = false;
    private static final Boolean UPDATED_RECALL = true;

    private static final Boolean DEFAULT_CONNECT = false;
    private static final Boolean UPDATED_CONNECT = true;

    private static final Boolean DEFAULT_TAJWEED = false;
    private static final Boolean UPDATED_TAJWEED = true;

    private static final Boolean DEFAULT_MAKHRAJ = false;
    private static final Boolean UPDATED_MAKHRAJ = true;

    private static final Instant DEFAULT_CREATE_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATE_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/trackers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrackerRepository trackerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrackerMockMvc;

    private Tracker tracker;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tracker createEntity(EntityManager em) {
        Tracker tracker = new Tracker()
            .page(DEFAULT_PAGE)
            .word(DEFAULT_WORD)
            .recall(DEFAULT_RECALL)
            .connect(DEFAULT_CONNECT)
            .tajweed(DEFAULT_TAJWEED)
            .makhraj(DEFAULT_MAKHRAJ)
            .createTimestamp(DEFAULT_CREATE_TIMESTAMP);
        return tracker;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tracker createUpdatedEntity(EntityManager em) {
        Tracker tracker = new Tracker()
            .page(UPDATED_PAGE)
            .word(UPDATED_WORD)
            .recall(UPDATED_RECALL)
            .connect(UPDATED_CONNECT)
            .tajweed(UPDATED_TAJWEED)
            .makhraj(UPDATED_MAKHRAJ)
            .createTimestamp(UPDATED_CREATE_TIMESTAMP);
        return tracker;
    }

    @BeforeEach
    public void initTest() {
        tracker = createEntity(em);
    }

    @Test
    @Transactional
    void createTracker() throws Exception {
        int databaseSizeBeforeCreate = trackerRepository.findAll().size();
        // Create the Tracker
        restTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tracker)))
            .andExpect(status().isCreated());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeCreate + 1);
        Tracker testTracker = trackerList.get(trackerList.size() - 1);
        assertThat(testTracker.getPage()).isEqualTo(DEFAULT_PAGE);
        assertThat(testTracker.getWord()).isEqualTo(DEFAULT_WORD);
        assertThat(testTracker.getRecall()).isEqualTo(DEFAULT_RECALL);
        assertThat(testTracker.getConnect()).isEqualTo(DEFAULT_CONNECT);
        assertThat(testTracker.getTajweed()).isEqualTo(DEFAULT_TAJWEED);
        assertThat(testTracker.getMakhraj()).isEqualTo(DEFAULT_MAKHRAJ);
        assertThat(testTracker.getCreateTimestamp()).isEqualTo(DEFAULT_CREATE_TIMESTAMP);
    }

    @Test
    @Transactional
    void createTrackerWithExistingId() throws Exception {
        // Create the Tracker with an existing ID
        tracker.setId(1L);

        int databaseSizeBeforeCreate = trackerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tracker)))
            .andExpect(status().isBadRequest());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreateTimestampIsRequired() throws Exception {
        int databaseSizeBeforeTest = trackerRepository.findAll().size();
        // set the field null
        tracker.setCreateTimestamp(null);

        // Create the Tracker, which fails.

        restTrackerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tracker)))
            .andExpect(status().isBadRequest());

        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTrackers() throws Exception {
        // Initialize the database
        trackerRepository.saveAndFlush(tracker);

        // Get all the trackerList
        restTrackerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tracker.getId().intValue())))
            .andExpect(jsonPath("$.[*].page").value(hasItem(DEFAULT_PAGE)))
            .andExpect(jsonPath("$.[*].word").value(hasItem(DEFAULT_WORD)))
            .andExpect(jsonPath("$.[*].recall").value(hasItem(DEFAULT_RECALL.booleanValue())))
            .andExpect(jsonPath("$.[*].connect").value(hasItem(DEFAULT_CONNECT.booleanValue())))
            .andExpect(jsonPath("$.[*].tajweed").value(hasItem(DEFAULT_TAJWEED.booleanValue())))
            .andExpect(jsonPath("$.[*].makhraj").value(hasItem(DEFAULT_MAKHRAJ.booleanValue())))
            .andExpect(jsonPath("$.[*].createTimestamp").value(hasItem(DEFAULT_CREATE_TIMESTAMP.toString())));
    }

    @Test
    @Transactional
    void getTracker() throws Exception {
        // Initialize the database
        trackerRepository.saveAndFlush(tracker);

        // Get the tracker
        restTrackerMockMvc
            .perform(get(ENTITY_API_URL_ID, tracker.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tracker.getId().intValue()))
            .andExpect(jsonPath("$.page").value(DEFAULT_PAGE))
            .andExpect(jsonPath("$.word").value(DEFAULT_WORD))
            .andExpect(jsonPath("$.recall").value(DEFAULT_RECALL.booleanValue()))
            .andExpect(jsonPath("$.connect").value(DEFAULT_CONNECT.booleanValue()))
            .andExpect(jsonPath("$.tajweed").value(DEFAULT_TAJWEED.booleanValue()))
            .andExpect(jsonPath("$.makhraj").value(DEFAULT_MAKHRAJ.booleanValue()))
            .andExpect(jsonPath("$.createTimestamp").value(DEFAULT_CREATE_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTracker() throws Exception {
        // Get the tracker
        restTrackerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTracker() throws Exception {
        // Initialize the database
        trackerRepository.saveAndFlush(tracker);

        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();

        // Update the tracker
        Tracker updatedTracker = trackerRepository.findById(tracker.getId()).get();
        // Disconnect from session so that the updates on updatedTracker are not directly saved in db
        em.detach(updatedTracker);
        updatedTracker
            .page(UPDATED_PAGE)
            .word(UPDATED_WORD)
            .recall(UPDATED_RECALL)
            .connect(UPDATED_CONNECT)
            .tajweed(UPDATED_TAJWEED)
            .makhraj(UPDATED_MAKHRAJ)
            .createTimestamp(UPDATED_CREATE_TIMESTAMP);

        restTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTracker))
            )
            .andExpect(status().isOk());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
        Tracker testTracker = trackerList.get(trackerList.size() - 1);
        assertThat(testTracker.getPage()).isEqualTo(UPDATED_PAGE);
        assertThat(testTracker.getWord()).isEqualTo(UPDATED_WORD);
        assertThat(testTracker.getRecall()).isEqualTo(UPDATED_RECALL);
        assertThat(testTracker.getConnect()).isEqualTo(UPDATED_CONNECT);
        assertThat(testTracker.getTajweed()).isEqualTo(UPDATED_TAJWEED);
        assertThat(testTracker.getMakhraj()).isEqualTo(UPDATED_MAKHRAJ);
        assertThat(testTracker.getCreateTimestamp()).isEqualTo(UPDATED_CREATE_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingTracker() throws Exception {
        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();
        tracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tracker.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTracker() throws Exception {
        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();
        tracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTracker() throws Exception {
        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();
        tracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tracker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrackerWithPatch() throws Exception {
        // Initialize the database
        trackerRepository.saveAndFlush(tracker);

        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();

        // Update the tracker using partial update
        Tracker partialUpdatedTracker = new Tracker();
        partialUpdatedTracker.setId(tracker.getId());

        partialUpdatedTracker.page(UPDATED_PAGE).createTimestamp(UPDATED_CREATE_TIMESTAMP);

        restTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTracker))
            )
            .andExpect(status().isOk());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
        Tracker testTracker = trackerList.get(trackerList.size() - 1);
        assertThat(testTracker.getPage()).isEqualTo(UPDATED_PAGE);
        assertThat(testTracker.getWord()).isEqualTo(DEFAULT_WORD);
        assertThat(testTracker.getRecall()).isEqualTo(DEFAULT_RECALL);
        assertThat(testTracker.getConnect()).isEqualTo(DEFAULT_CONNECT);
        assertThat(testTracker.getTajweed()).isEqualTo(DEFAULT_TAJWEED);
        assertThat(testTracker.getMakhraj()).isEqualTo(DEFAULT_MAKHRAJ);
        assertThat(testTracker.getCreateTimestamp()).isEqualTo(UPDATED_CREATE_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateTrackerWithPatch() throws Exception {
        // Initialize the database
        trackerRepository.saveAndFlush(tracker);

        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();

        // Update the tracker using partial update
        Tracker partialUpdatedTracker = new Tracker();
        partialUpdatedTracker.setId(tracker.getId());

        partialUpdatedTracker
            .page(UPDATED_PAGE)
            .word(UPDATED_WORD)
            .recall(UPDATED_RECALL)
            .connect(UPDATED_CONNECT)
            .tajweed(UPDATED_TAJWEED)
            .makhraj(UPDATED_MAKHRAJ)
            .createTimestamp(UPDATED_CREATE_TIMESTAMP);

        restTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTracker))
            )
            .andExpect(status().isOk());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
        Tracker testTracker = trackerList.get(trackerList.size() - 1);
        assertThat(testTracker.getPage()).isEqualTo(UPDATED_PAGE);
        assertThat(testTracker.getWord()).isEqualTo(UPDATED_WORD);
        assertThat(testTracker.getRecall()).isEqualTo(UPDATED_RECALL);
        assertThat(testTracker.getConnect()).isEqualTo(UPDATED_CONNECT);
        assertThat(testTracker.getTajweed()).isEqualTo(UPDATED_TAJWEED);
        assertThat(testTracker.getMakhraj()).isEqualTo(UPDATED_MAKHRAJ);
        assertThat(testTracker.getCreateTimestamp()).isEqualTo(UPDATED_CREATE_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingTracker() throws Exception {
        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();
        tracker.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tracker.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTracker() throws Exception {
        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();
        tracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tracker))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTracker() throws Exception {
        int databaseSizeBeforeUpdate = trackerRepository.findAll().size();
        tracker.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrackerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tracker)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tracker in the database
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTracker() throws Exception {
        // Initialize the database
        trackerRepository.saveAndFlush(tracker);

        int databaseSizeBeforeDelete = trackerRepository.findAll().size();

        // Delete the tracker
        restTrackerMockMvc
            .perform(delete(ENTITY_API_URL_ID, tracker.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tracker> trackerList = trackerRepository.findAll();
        assertThat(trackerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
