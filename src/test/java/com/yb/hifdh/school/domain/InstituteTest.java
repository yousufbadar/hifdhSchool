package com.yb.hifdh.school.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.yb.hifdh.school.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InstituteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Institute.class);
        Institute institute1 = new Institute();
        institute1.setId(1L);
        Institute institute2 = new Institute();
        institute2.setId(institute1.getId());
        assertThat(institute1).isEqualTo(institute2);
        institute2.setId(2L);
        assertThat(institute1).isNotEqualTo(institute2);
        institute1.setId(null);
        assertThat(institute1).isNotEqualTo(institute2);
    }
}
