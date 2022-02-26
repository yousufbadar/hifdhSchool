package com.yb.hifdh.school.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tracker.
 */
@Entity
@Table(name = "tracker")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tracker implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "page")
    private Integer page;

    @Column(name = "word")
    private Integer word;

    @Column(name = "recall")
    private Boolean recall;

    @Column(name = "connect")
    private Boolean connect;

    @Column(name = "tajweed")
    private Boolean tajweed;

    @Column(name = "makhraj")
    private Boolean makhraj;

    @NotNull
    @Column(name = "create_timestamp", nullable = false)
    private Instant createTimestamp;

    @ManyToOne
    @JsonIgnoreProperties(value = { "institute" }, allowSetters = true)
    private Student student;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tracker id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPage() {
        return this.page;
    }

    public Tracker page(Integer page) {
        this.setPage(page);
        return this;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getWord() {
        return this.word;
    }

    public Tracker word(Integer word) {
        this.setWord(word);
        return this;
    }

    public void setWord(Integer word) {
        this.word = word;
    }

    public Boolean getRecall() {
        return this.recall;
    }

    public Tracker recall(Boolean recall) {
        this.setRecall(recall);
        return this;
    }

    public void setRecall(Boolean recall) {
        this.recall = recall;
    }

    public Boolean getConnect() {
        return this.connect;
    }

    public Tracker connect(Boolean connect) {
        this.setConnect(connect);
        return this;
    }

    public void setConnect(Boolean connect) {
        this.connect = connect;
    }

    public Boolean getTajweed() {
        return this.tajweed;
    }

    public Tracker tajweed(Boolean tajweed) {
        this.setTajweed(tajweed);
        return this;
    }

    public void setTajweed(Boolean tajweed) {
        this.tajweed = tajweed;
    }

    public Boolean getMakhraj() {
        return this.makhraj;
    }

    public Tracker makhraj(Boolean makhraj) {
        this.setMakhraj(makhraj);
        return this;
    }

    public void setMakhraj(Boolean makhraj) {
        this.makhraj = makhraj;
    }

    public Instant getCreateTimestamp() {
        return this.createTimestamp;
    }

    public Tracker createTimestamp(Instant createTimestamp) {
        this.setCreateTimestamp(createTimestamp);
        return this;
    }

    public void setCreateTimestamp(Instant createTimestamp) {
        this.createTimestamp = createTimestamp;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Tracker student(Student student) {
        this.setStudent(student);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tracker)) {
            return false;
        }
        return id != null && id.equals(((Tracker) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tracker{" +
            "id=" + getId() +
            ", page=" + getPage() +
            ", word=" + getWord() +
            ", recall='" + getRecall() + "'" +
            ", connect='" + getConnect() + "'" +
            ", tajweed='" + getTajweed() + "'" +
            ", makhraj='" + getMakhraj() + "'" +
            ", createTimestamp='" + getCreateTimestamp() + "'" +
            "}";
    }
}
