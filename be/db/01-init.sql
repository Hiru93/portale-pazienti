-- Table status
DROP TABLE IF EXISTS status;
CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table field
DROP TABLE IF EXISTS field;
CREATE TABLE field (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table document
DROP TABLE IF EXISTS document;
CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Table role
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    auth_list jsonb NOT NULL
);

-- Table day
DROP TABLE IF EXISTS day;
CREATE TABLE day (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table specialist
DROP TABLE IF EXISTS specialist;
CREATE TABLE specialist (
    id SERIAL PRIMARY KEY,
    id_role INTEGER NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    cod_fisc VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cap VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    p_iva VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(1) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    clinic_name VARCHAR(255) NOT NULL,
    clinic_cap VARCHAR(255) NOT NULL,
    clinic_city VARCHAR(255) NOT NULL,
    clinic_address VARCHAR(255) NOT NULL,
    clinic_phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_role) REFERENCES role(id),
    UNIQUE(email)
);

-- Table opening_schedule
DROP TABLE IF EXISTS opening_schedule;
CREATE TABLE opening_schedule (
    id SERIAL PRIMARY KEY,
    id_day INTEGER NOT NULL,
    id_specialist INTEGER NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    opening_morning TIME NOT NULL,
    closing_morning TIME NOT NULL,
    opening_afternoon TIME NOT NULL,
    closing_afternoon TIME NOT NULL,
    slot_size_minutes INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_day) REFERENCES day(id),
    FOREIGN KEY (id_specialist) REFERENCES specialist(id)
);

-- Table patient
DROP TABLE IF EXISTS patient;
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    id_role INTEGER NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cap VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cod_fisc VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    birth_place VARCHAR(255) NOT NULL,
    sex VARCHAR(1) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_role) REFERENCES role(id),
    UNIQUE(email)
);

-- Table bo_operator
DROP TABLE IF EXISTS bo_operator;
CREATE TABLE bo_operator (
    id SERIAL PRIMARY KEY,
    id_role INTEGER NOT NULL,
    id_field INTEGER NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_role) REFERENCES role(id),
    FOREIGN KEY (id_field) REFERENCES field(id),
    UNIQUE(email)
);

-- Table request
DROP TABLE IF EXISTS request;
CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    id_status INTEGER NOT NULL,
    id_operator INTEGER NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    nature VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_status) REFERENCES status (id),
    FOREIGN KEY (id_operator) REFERENCES bo_operator(id)
);

-- Table health_service
DROP TABLE IF EXISTS health_service;
CREATE TABLE health_service (
    id SERIAL PRIMARY KEY,
    id_specialist INTEGER NOT NULL,
    id_patient INTEGER NOT NULL,
    id_request INTEGER NOT NULL,
    id_document INTEGER NOT NULL,
    free_service BOOLEAN NOT NULL DEFAULT FALSE,
    date DATE NOT NULL,
    report TEXT NOT NULL,
    pregnancy_month INTEGER NOT NULL,
    pregnancy_week INTEGER NOT NULL,
    teeth_brushing_frequency INTEGER NOT NULL,
    smoking BOOLEAN NOT NULL,
    does_year_checkup BOOLEAN NOT NULL,
    currently_ill BOOLEAN NOT NULL,
    current_illness jsonb NOT NULL,
    specific_diet BOOLEAN NOT NULL,
    actively_reach_asl_out BOOLEAN NOT NULL,
    missing_teeth BOOLEAN NOT NULL,
    missing_teeth_number INTEGER NOT NULL,
    missing_teeth_location jsonb NOT NULL,
    cavited_teeth BOOLEAN NOT NULL,
    cavited_teeth_number INTEGER NOT NULL,
    cavited_teeth_location jsonb NOT NULL,
    dental_prosthesis_or_implants BOOLEAN NOT NULL,
    dental_prosthesis_or_implants_number INTEGER NOT NULL,
    dental_prosthesis_or_implants_location jsonb NOT NULL,
    tartar BOOLEAN NOT NULL,
    tartar_number INTEGER NOT NULL,
    tartar_location jsonb NOT NULL,
    dental_plaque BOOLEAN NOT NULL,
    dental_plaque_number INTEGER NOT NULL,
    dental_plaque_location jsonb NOT NULL,
    in_need_of_treatment BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_specialist) REFERENCES specialist(id),
    FOREIGN KEY (id_patient) REFERENCES patient(id),
    FOREIGN KEY (id_request) REFERENCES request(id),
    FOREIGN KEY (id_document) REFERENCES document(id)
);

-- Table appointments
DROP TABLE IF EXISTS appointment;
CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    id_patient   INTEGER NOT NULL,
    id_specialist INTEGER NOT NULL,
    id_status    INTEGER NOT NULL,
    date         DATE NOT NULL,
    time_start   TIME NOT NULL,
    time_end     TIME NOT NULL,
    notes        TEXT,
    deleted      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at   TIMESTAMP,
    FOREIGN KEY (id_patient)    REFERENCES patient(id),
    FOREIGN KEY (id_specialist) REFERENCES specialist(id),
    FOREIGN KEY (id_status)     REFERENCES status(id),
    UNIQUE (id_specialist, date, time_start)  -- prevent double-booking
);

-- Table user_to_document
DROP TABLE IF EXISTS user_to_document;
CREATE TABLE user_to_document (
    id SERIAL PRIMARY KEY,
    id_patient INTEGER NOT NULL,
    id_specialist INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patient(id),
    FOREIGN KEY (id_specialist) REFERENCES specialist(id)
);

-- Table user_credential
DROP TABLE IF EXISTS user_credential;
CREATE TABLE user_credential (
    id SERIAL PRIMARY KEY,
    id_patient INTEGER NULL,
    id_specialist INTEGER NULL,
    id_operator INTEGER NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    password_recovery_token VARCHAR(255),
    last_login_at TIMESTAMP,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patient(id),
    FOREIGN KEY (id_specialist) REFERENCES specialist(id),
    FOREIGN KEY (id_operator) REFERENCES bo_operator(id),
    UNIQUE(email)
);

-- Table migrations
DROP TABLE IF EXISTS migrations;
CREATE TABLE migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch VARCHAR(255) NOT NULL,
    migration_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table email_notification
DROP TABLE IF EXISTS email_notification;
CREATE TABLE email_notification (
    id SERIAL PRIMARY KEY,
    id_patient INTEGER NULL,
    id_specialist INTEGER NULL,
    id_operator INTEGER NULL,
    type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patient(id),
    FOREIGN KEY (id_specialist) REFERENCES specialist(id),
    FOREIGN KEY (id_operator) REFERENCES bo_operator(id)
);

-- Table sms_notification_reception_state
DROP TABLE IF EXISTS sms_notification_reception_state;
CREATE TABLE sms_notification_reception_state (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table sms_notification_dispatch_error_state
DROP TABLE IF EXISTS sms_notification_dispatch_error_state;
CREATE TABLE sms_notification_dispatch_error_state (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table sms_notification_dispatch_state
DROP TABLE IF EXISTS sms_notification_dispatch_state;
CREATE TABLE sms_notification_dispatch_state (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table sms_notification_response
DROP TABLE IF EXISTS sms_notification_response;
CREATE TABLE sms_notification_response (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table notification
DROP TABLE IF EXISTS notification;
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL
);

-- Table sms_notification
DROP TABLE IF EXISTS sms_notification;
CREATE TABLE sms_notification (
    id SERIAL PRIMARY KEY,
    id_patient INTEGER NOT NULL,
    id_sms_notification_reception_state INTEGER NOT NULL,
    id_sms_notification_dispatch_error_state INTEGER NOT NULL,
    id_sms_notification_dispatch_state INTEGER NOT NULL,
    id_sms_notification_response INTEGER NOT NULL,
    id_notification INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_patient) REFERENCES patient(id),
    FOREIGN KEY (id_sms_notification_reception_state) REFERENCES sms_notification_reception_state(id),
    FOREIGN KEY (id_sms_notification_dispatch_error_state) REFERENCES sms_notification_dispatch_error_state(id),
    FOREIGN KEY (id_sms_notification_dispatch_state) REFERENCES sms_notification_dispatch_state(id),
    FOREIGN KEY (id_sms_notification_response) REFERENCES sms_notification_response(id),
    FOREIGN KEY (id_notification) REFERENCES notification(id)
);