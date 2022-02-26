package com.yb.hifdh.school.repository;

import com.yb.hifdh.school.domain.Tracker;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tracker entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TrackerRepository extends JpaRepository<Tracker, Long> {}
