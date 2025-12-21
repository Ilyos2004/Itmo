-- Organizations
CREATE TABLE organizations (
                               id bigserial PRIMARY KEY,
                               official_address_street text,
                               annual_turnover integer NOT NULL CHECK (annual_turnover > 0),
                               employees_count bigint NOT NULL CHECK (employees_count > 0),
                               rating integer NOT NULL CHECK (rating > 0),
                               type varchar(50) NOT NULL
);


CREATE TABLE persons (
                         id bigserial PRIMARY KEY,
                         eye_color varchar(20),
                         hair_color varchar(20) NOT NULL,
                         location_x double precision NOT NULL,
                         location_y integer NOT NULL,
                         location_z double precision NOT NULL,
                         location_name text NOT NULL,
                         birthday timestamp NOT NULL,
                         height bigint CHECK (height > 0),
                         weight double precision CHECK (weight > 0),
                         passport_id varchar(47) NOT NULL UNIQUE
);

-- Workers
CREATE TABLE workers (
                         id bigserial PRIMARY KEY,
                         name text NOT NULL,
                         coordinates_x integer NOT NULL,
                         coordinates_y double precision NOT NULL,
                         creation_date timestamp NOT NULL DEFAULT now(),
                         organization_id bigint NOT NULL,
                         salary double precision NOT NULL CHECK (salary > 0),
                         rating integer CHECK (rating > 0),
                         start_date timestamptz NOT NULL,
                         end_date date,
                         status varchar(50),
                         person_id bigint,
                         CONSTRAINT fk_worker_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
                         CONSTRAINT fk_worker_person FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE CASCADE
);

-- Indexes for filtering/sorting
CREATE INDEX idx_workers_name ON workers (name);
CREATE INDEX idx_workers_start_date ON workers (start_date);
CREATE INDEX idx_workers_rating ON workers (rating);

-- Required SQL functions (specops)

-- 1) count by rating
CREATE OR REPLACE FUNCTION count_workers_by_rating(r INTEGER) RETURNS INTEGER AS $$
BEGIN
RETURN (SELECT COUNT(*) FROM workers WHERE rating = r);
END;
$$ LANGUAGE plpgsql;

-- 2) workers with start_date before ts (returns setof workers rows)
CREATE OR REPLACE FUNCTION workers_with_start_before(ts timestamptz)
RETURNS TABLE(id bigint, name text, start_date timestamptz) AS $$
BEGIN
RETURN QUERY SELECT id, name, start_date FROM workers WHERE start_date < ts;
END;
$$ LANGUAGE plpgsql;

-- 3) unique person ids
CREATE OR REPLACE FUNCTION unique_persons()
RETURNS TABLE(person_id bigint) AS $$
BEGIN
RETURN QUERY SELECT DISTINCT person_id FROM workers WHERE person_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 4) fire worker (delete)
CREATE OR REPLACE FUNCTION fire_worker_by_id(wid bigint) RETURNS void AS $$
BEGIN
DELETE FROM workers WHERE id = wid;
END;
$$ LANGUAGE plpgsql;

-- 5) index salary by factor
CREATE OR REPLACE FUNCTION index_salary(wid bigint, factor double precision) RETURNS void AS $$
BEGIN
UPDATE workers SET salary = salary * factor WHERE id = wid;
END;
$$ LANGUAGE plpgsql;
