package com.yb.hifdh.school.repository;

import com.yb.hifdh.school.domain.Institute;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Institute entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstituteRepository extends JpaRepository<Institute, Long> {}
