WELLNEST: Elderly Care Health Management System

📌 Project Overview
WELLNEST is an Elderly Care Health Management System designed to streamline and enhance healthcare services for elderly individuals. It provides an efficient platform for healthcare professionals to manage appointments, virtual consultations, and patient records while ensuring seamless communication between caregivers and patients.

🚀 Features


🔹 Appointment Management
- Create, update, and delete physical appointments.
- View upcoming and past appointments.
- Approve or reject appointment requests.
- Notify users when appointments are approved or canceled.

🔹 Virtual Consultation
- Healthcare professionals can offer online consultations.
- Users can book virtual appointments based on availability.
- Meeting links and consultation notes are recorded.
- Payment processing for virtual consultations.

🔹 User & Profile Management
- Secure authentication & authorization system.
- Healthcare professionals and patients can manage their profiles.
- Profile images are stored and retrieved securely.

🔹 Notifications System
- Real-time notifications for appointment approvals, rejections, and updates.
- Users receive alerts for upcoming appointments.

🏗️ Tech Stack 


Backend: 
- Node.js with Express.js – API development.
- PostgreSQL – Database for storing appointments, user profiles, and consultations.

Frontend: (Not included in this repo, if applicable)
- React.js 

Other Technologies:
- JWT Authentication – Secure login system.
- AES - Encrypt sensitive data.

🛠️ Setup & Installation

1. Clone the Repository
- git clone https://github.com/your-username/wellnest.git
- cd wellnest

2. Install Dependencies
- npm install

3. Setup Environment Variables
-Create a .env file in the root directory and add the following:
  - DATABASE_URL=your_postgresql_connection_string
  - JWT_SECRET=your_jwt_secret
  - PORT=5001

4. Run the Application
- npm start

Server runs on http://localhost:5001/ by default.

🛠️ Database Setup

1. Install PostgreSQL on your machine.

2. Create a new database "WellNest" on pgAdmin4.

3. Create table using the query:
   
-- Table: public.assessment_history

-- DROP TABLE IF EXISTS public.assessment_history;

   CREATE TABLE IF NOT EXISTS public.assessment_history
(
    assessment_history_id integer NOT NULL DEFAULT nextval('assessment_history_assessment_history_id_seq'::regclass),
    user_id integer NOT NULL,
    assessment_id integer NOT NULL,
    total_marks integer NOT NULL,
    overall_result character varying(255) COLLATE pg_catalog."default" NOT NULL,
    assessment_date timestamp without time zone DEFAULT now(),
    CONSTRAINT assessment_history_pkey PRIMARY KEY (assessment_history_id),
    CONSTRAINT assessment_history_assessment_id_fkey FOREIGN KEY (assessment_id)
        REFERENCES public.co_assessments (assessment_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT assessment_history_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.assessment_history
    OWNER to postgres;

-- Table: public.assessment_results

-- DROP TABLE IF EXISTS public.assessment_results;

CREATE TABLE IF NOT EXISTS public.assessment_results
(
    result_id integer NOT NULL DEFAULT nextval('assessment_results_result_id_seq'::regclass),
    assessment_id integer NOT NULL,
    score_range character varying(20) COLLATE pg_catalog."default" NOT NULL,
    result_text character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT assessment_results_pkey PRIMARY KEY (result_id),
    CONSTRAINT assessment_results_assessment_id_fkey FOREIGN KEY (assessment_id)
        REFERENCES public.co_assessments (assessment_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.assessment_results
    OWNER to postgres;

-- Table: public.care_plans

-- DROP TABLE IF EXISTS public.care_plans;

CREATE TABLE IF NOT EXISTS public.care_plans
(
    careplan_id integer NOT NULL DEFAULT nextval('care_plans_careplan_id_seq'::regclass),
    user_id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    plan text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    writer_id integer,
    CONSTRAINT care_plans_pkey PRIMARY KEY (careplan_id),
    CONSTRAINT care_plans_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.care_plans
    OWNER to postgres;


-- Table: public.co_assessment_answers

-- DROP TABLE IF EXISTS public.co_assessment_answers;

CREATE TABLE IF NOT EXISTS public.co_assessment_answers
(
    answer_id integer NOT NULL DEFAULT nextval('answers_answer_id_seq'::regclass),
    question_id integer NOT NULL,
    answer_text text COLLATE pg_catalog."default" NOT NULL,
    mark integer NOT NULL,
    CONSTRAINT answers_pkey PRIMARY KEY (answer_id),
    CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id)
        REFERENCES public.co_assessment_questions (question_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.co_assessment_answers
    OWNER to postgres;


-- Table: public.co_assessment_questions

-- DROP TABLE IF EXISTS public.co_assessment_questions;

CREATE TABLE IF NOT EXISTS public.co_assessment_questions
(
    question_id integer NOT NULL DEFAULT nextval('questions_question_id_seq'::regclass),
    assessment_id integer NOT NULL,
    question_text text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT questions_pkey PRIMARY KEY (question_id),
    CONSTRAINT questions_assessment_id_fkey FOREIGN KEY (assessment_id)
        REFERENCES public.co_assessments (assessment_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.co_assessment_questions
    OWNER to postgres;


-- Table: public.co_assessments

-- DROP TABLE IF EXISTS public.co_assessments;

CREATE TABLE IF NOT EXISTS public.co_assessments
(
    assessment_id integer NOT NULL DEFAULT nextval('assessments_assessment_id_seq'::regclass),
    co_id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    photo bytea,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT assessments_pkey PRIMARY KEY (assessment_id),
    CONSTRAINT assessments_co_id_fkey FOREIGN KEY (co_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.co_assessments
    OWNER to postgres;


-- Table: public.co_available_events

-- DROP TABLE IF EXISTS public.co_available_events;

CREATE TABLE IF NOT EXISTS public.co_available_events
(
    id integer NOT NULL DEFAULT nextval('events_id_seq'::regclass),
    co_id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fees character varying(255) COLLATE pg_catalog."default",
    location text COLLATE pg_catalog."default" NOT NULL,
    event_date character varying(255) COLLATE pg_catalog."default" NOT NULL,
    event_time character varying(255) COLLATE pg_catalog."default" NOT NULL,
    notes text COLLATE pg_catalog."default",
    terms_and_conditions text COLLATE pg_catalog."default" NOT NULL,
    photo bytea,
    registration_due date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    capacity character varying(255) COLLATE pg_catalog."default",
    event_status character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_co_id_fkey FOREIGN KEY (co_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.co_available_events
    OWNER to postgres;


-- Table: public.co_available_opportunities

-- DROP TABLE IF EXISTS public.co_available_opportunities;

CREATE TABLE IF NOT EXISTS public.co_available_opportunities
(
    id integer NOT NULL DEFAULT nextval('co_available_opportunities_id_seq'::regclass),
    co_id integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fees character varying(255) COLLATE pg_catalog."default",
    location text COLLATE pg_catalog."default" NOT NULL,
    opportunity_date character varying(255) COLLATE pg_catalog."default" NOT NULL,
    opportunity_time character varying(255) COLLATE pg_catalog."default" NOT NULL,
    notes text COLLATE pg_catalog."default",
    terms_and_conditions text COLLATE pg_catalog."default" NOT NULL,
    photo bytea,
    registration_due date,
    capacity character varying(255) COLLATE pg_catalog."default",
    opportunity_status character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT co_available_opportunities_pkey PRIMARY KEY (id),
    CONSTRAINT co_available_opportunities_co_id_fkey FOREIGN KEY (co_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT co_available_opportunities_co_id_fkey1 FOREIGN KEY (co_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.co_available_opportunities
    OWNER to postgres;


-- Table: public.co_profile

-- DROP TABLE IF EXISTS public.co_profile;

CREATE TABLE IF NOT EXISTS public.co_profile
(
    id integer NOT NULL DEFAULT nextval('co_profile_id_seq'::regclass),
    user_id integer NOT NULL,
    age integer,
    gender character varying(10) COLLATE pg_catalog."default",
    date_of_birth date,
    address character varying(255) COLLATE pg_catalog."default",
    emergency_contact character varying(13) COLLATE pg_catalog."default",
    organizer_details text COLLATE pg_catalog."default",
    profile_image bytea,
    username character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT co_profile_pkey PRIMARY KEY (id),
    CONSTRAINT co_profile_user_id_key UNIQUE (user_id),
    CONSTRAINT co_profile_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.co_profile
    OWNER to postgres;


-- Table: public.collaborators

-- DROP TABLE IF EXISTS public.collaborators;

CREATE TABLE IF NOT EXISTS public.collaborators
(
    collab_id integer NOT NULL DEFAULT nextval('collaborators_collab_id_seq'::regclass),
    user_id integer NOT NULL,
    collaborator_id integer NOT NULL,
    relationship character varying(50) COLLATE pg_catalog."default" NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT collaborators_pkey PRIMARY KEY (collab_id),
    CONSTRAINT collaborators_collaborator_id_fkey FOREIGN KEY (collaborator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT collaborators_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.collaborators
    OWNER to postgres;


-- Table: public.event_participants

-- DROP TABLE IF EXISTS public.event_participants;

CREATE TABLE IF NOT EXISTS public.event_participants
(
    id integer NOT NULL DEFAULT nextval('event_participants_id_seq'::regclass),
    user_id integer NOT NULL,
    event_id integer NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'Ongoing'::character varying,
    CONSTRAINT event_participants_pkey PRIMARY KEY (id),
    CONSTRAINT event_participants_event_id_user_id_key UNIQUE (event_id, user_id),
    CONSTRAINT event_participants_event_id_fkey FOREIGN KEY (event_id)
        REFERENCES public.co_available_events (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT event_participants_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.event_participants
    OWNER to postgres;


-- Table: public.favorites

-- DROP TABLE IF EXISTS public.favorites;

CREATE TABLE IF NOT EXISTS public.favorites
(
    id integer NOT NULL DEFAULT nextval('favorites_id_seq'::regclass),
    user_id integer NOT NULL,
    availability_id integer,
    virtual_availability_id integer,
    CONSTRAINT favorites_pkey PRIMARY KEY (id),
    CONSTRAINT favorites_user_id_availability_id_key UNIQUE (user_id, availability_id),
    CONSTRAINT favorites_availability_id_fkey FOREIGN KEY (availability_id)
        REFERENCES public.hp_availability (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT check_availability_or_virtual_availability CHECK (availability_id IS NOT NULL AND virtual_availability_id IS NULL OR availability_id IS NULL AND virtual_availability_id IS NOT NULL)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.favorites
    OWNER to postgres;


-- Table: public.hp_appointments

-- DROP TABLE IF EXISTS public.hp_appointments;

CREATE TABLE IF NOT EXISTS public.hp_appointments
(
    hp_app_id integer NOT NULL DEFAULT nextval('healthcare_provider_appointments_hp_app_id_seq'::regclass),
    hp_id integer NOT NULL,
    u_id integer NOT NULL,
    app_date date NOT NULL,
    app_time time without time zone NOT NULL,
    app_status character varying(60) COLLATE pg_catalog."default",
    app_sickness character varying(150) COLLATE pg_catalog."default",
    medical_coverage character varying(50) COLLATE pg_catalog."default",
    who_will_see character varying(50) COLLATE pg_catalog."default",
    patient_seen_before character varying(50) COLLATE pg_catalog."default",
    note text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT healthcare_provider_appointments_pkey PRIMARY KEY (hp_app_id),
    CONSTRAINT healthcare_provider_appointments_hp_id_fkey FOREIGN KEY (hp_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT healthcare_provider_appointments_u_id_fkey FOREIGN KEY (u_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hp_appointments
    OWNER to postgres;

-- Trigger: set_updated_at

-- DROP TRIGGER IF EXISTS set_updated_at ON public.hp_appointments;

CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE 
    ON public.hp_appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- Table: public.hp_availability

-- DROP TABLE IF EXISTS public.hp_availability;

CREATE TABLE IF NOT EXISTS public.hp_availability
(
    id integer NOT NULL DEFAULT nextval('provider_availability_id_seq'::regclass),
    description text COLLATE pg_catalog."default" NOT NULL,
    location character varying(255) COLLATE pg_catalog."default" NOT NULL,
    available_days character varying(50) COLLATE pg_catalog."default" NOT NULL,
    available_times text[] COLLATE pg_catalog."default" NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    category character varying(255) COLLATE pg_catalog."default",
    hospital_address character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT provider_availability_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hp_availability
    OWNER to postgres;


-- Table: public.hp_profile

-- DROP TABLE IF EXISTS public.hp_profile;

CREATE TABLE IF NOT EXISTS public.hp_profile
(
    id integer NOT NULL DEFAULT nextval('hp_profile_id_seq'::regclass),
    user_id integer,
    username character varying(50) COLLATE pg_catalog."default",
    age integer,
    gender character varying(10) COLLATE pg_catalog."default",
    date_of_birth date,
    address character varying(255) COLLATE pg_catalog."default",
    emergency_contact character varying(13) COLLATE pg_catalog."default",
    summary text COLLATE pg_catalog."default",
    education text COLLATE pg_catalog."default",
    credentials text COLLATE pg_catalog."default",
    languages text COLLATE pg_catalog."default",
    services text COLLATE pg_catalog."default",
    business_hours character varying(50) COLLATE pg_catalog."default",
    business_days character varying(50) COLLATE pg_catalog."default",
    experience character varying(50) COLLATE pg_catalog."default",
    specialist character varying(50) COLLATE pg_catalog."default",
    hospital character varying(50) COLLATE pg_catalog."default",
    profile_image bytea,
    rating numeric(3,2) DEFAULT 0.00,
    CONSTRAINT hp_profile_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_id UNIQUE (user_id),
    CONSTRAINT hp_profile_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hp_profile
    OWNER to postgres;



-- Table: public.hp_virtual_appointment

-- DROP TABLE IF EXISTS public.hp_virtual_appointment;

CREATE TABLE IF NOT EXISTS public.hp_virtual_appointment
(
    hpva_id integer NOT NULL DEFAULT nextval('hp_virtual_appointment_hpva_id_seq'::regclass),
    hp_id integer NOT NULL,
    u_id integer NOT NULL,
    hpva_date date NOT NULL,
    hpva_time time without time zone NOT NULL,
    duration integer,
    status character varying(50) COLLATE pg_catalog."default" NOT NULL DEFAULT 'scheduled'::character varying,
    meeting_link text COLLATE pg_catalog."default",
    notes text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    payment_status character varying(50) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    fee numeric(10,2),
    receipt_url text COLLATE pg_catalog."default",
    service text COLLATE pg_catalog."default",
    symptoms character varying COLLATE pg_catalog."default",
    who_will_see character varying(50) COLLATE pg_catalog."default",
    patient_seen_before character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT hp_virtual_appointment_pkey PRIMARY KEY (hpva_id),
    CONSTRAINT hp_virtual_appointment_doctor_id_fkey FOREIGN KEY (hp_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT hp_virtual_appointment_patient_id_fkey FOREIGN KEY (u_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT hp_virtual_appointment_duration_check CHECK (duration > 0),
    CONSTRAINT hp_virtual_appointment_fee_check CHECK (fee >= 0::numeric)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hp_virtual_appointment
    OWNER to postgres;

-- Trigger: set_updated_at

-- DROP TRIGGER IF EXISTS set_updated_at ON public.hp_virtual_appointment;

CREATE OR REPLACE TRIGGER set_updated_at
    BEFORE UPDATE 
    ON public.hp_virtual_appointment
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- Table: public.hp_virtual_availability

-- DROP TABLE IF EXISTS public.hp_virtual_availability;

CREATE TABLE IF NOT EXISTS public.hp_virtual_availability
(
    id integer NOT NULL DEFAULT nextval('hp_virtual_availability_id_seq'::regclass),
    description text COLLATE pg_catalog."default" NOT NULL,
    services_provide jsonb NOT NULL,
    category text COLLATE pg_catalog."default" NOT NULL,
    available_days text COLLATE pg_catalog."default" NOT NULL,
    available_times text[] COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    bank_receiver_name text COLLATE pg_catalog."default",
    bank_name text COLLATE pg_catalog."default",
    account_number text COLLATE pg_catalog."default",
    hp_id integer NOT NULL,
    CONSTRAINT hp_virtual_availability_pkey PRIMARY KEY (id),
    CONSTRAINT fk_hp_id FOREIGN KEY (hp_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hp_virtual_availability
    OWNER to postgres;


-- Table: public.medical_reports

-- DROP TABLE IF EXISTS public.medical_reports;

CREATE TABLE IF NOT EXISTS public.medical_reports
(
    report_id integer NOT NULL DEFAULT nextval('medical_reports_report_id_seq'::regclass),
    appointment_id integer,
    encounter_summary text COLLATE pg_catalog."default",
    follow_up_date date,
    advice_given text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    appointment_type character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT medical_reports_pkey PRIMARY KEY (report_id),
    CONSTRAINT check_appointment_type CHECK (appointment_type::text = ANY (ARRAY['physical'::character varying, 'virtual'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.medical_reports
    OWNER to postgres;


-- Table: public.medications

-- DROP TABLE IF EXISTS public.medications;

CREATE TABLE IF NOT EXISTS public.medications
(
    id integer NOT NULL DEFAULT nextval('medications_id_seq'::regclass),
    pill_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    amount integer NOT NULL,
    duration integer NOT NULL,
    "time" time without time zone NOT NULL,
    food_relation character varying(50) COLLATE pg_catalog."default" NOT NULL,
    repeat_option character varying(50) COLLATE pg_catalog."default",
    medicine_image text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    u_id integer NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'Pending'::character varying,
    notification_times jsonb,
    frequency character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT medications_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (u_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.medications
    OWNER to postgres;


-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    notification_id integer NOT NULL DEFAULT nextval('notifications_notification_id_seq'::regclass),
    user_id integer NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notification_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;


-- Table: public.opportunity_participants

-- DROP TABLE IF EXISTS public.opportunity_participants;

CREATE TABLE IF NOT EXISTS public.opportunity_participants
(
    id integer NOT NULL DEFAULT nextval('opportunity_participants_id_seq'::regclass),
    user_id integer NOT NULL,
    opportunity_id integer NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) COLLATE pg_catalog."default" DEFAULT 'Ongoing'::character varying,
    CONSTRAINT opportunity_participants_pkey PRIMARY KEY (id),
    CONSTRAINT opportunity_participants_opportunity_id_user_id_key UNIQUE (opportunity_id, user_id),
    CONSTRAINT opportunity_participants_opportunity_id_fkey FOREIGN KEY (opportunity_id)
        REFERENCES public.co_available_opportunities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT opportunity_participants_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.opportunity_participants
    OWNER to postgres;


-- Table: public.profile

-- DROP TABLE IF EXISTS public.profile;

CREATE TABLE IF NOT EXISTS public.profile
(
    id integer NOT NULL DEFAULT nextval('profile_id_seq'::regclass),
    user_id integer NOT NULL,
    age integer,
    gender character varying(10) COLLATE pg_catalog."default",
    date_of_birth date,
    address character varying(255) COLLATE pg_catalog."default",
    emergency_contact character varying(13) COLLATE pg_catalog."default",
    core_qualifications text COLLATE pg_catalog."default",
    education text COLLATE pg_catalog."default",
    profile_image bytea,
    username character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT profile_pkey PRIMARY KEY (id),
    CONSTRAINT profile_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profile
    OWNER to postgres;


-- Table: public.ratings

-- DROP TABLE IF EXISTS public.ratings;

CREATE TABLE IF NOT EXISTS public.ratings
(
    id integer NOT NULL DEFAULT nextval('ratings_id_seq'::regclass),
    doctor_id integer NOT NULL,
    user_id integer NOT NULL,
    rating numeric(3,2) NOT NULL,
    review_text text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT ratings_pkey PRIMARY KEY (id),
    CONSTRAINT ratings_doctor_id_fkey FOREIGN KEY (doctor_id)
        REFERENCES public.hp_profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT ratings_rating_check CHECK (rating >= 0::numeric AND rating <= 5::numeric)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ratings
    OWNER to postgres;


-- Table: public.report_medicines

-- DROP TABLE IF EXISTS public.report_medicines;

CREATE TABLE IF NOT EXISTS public.report_medicines
(
    medicine_id integer NOT NULL DEFAULT nextval('report_medicines_medicine_id_seq'::regclass),
    report_id integer,
    name character varying(255) COLLATE pg_catalog."default",
    dosage character varying(255) COLLATE pg_catalog."default",
    duration character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT report_medicines_pkey PRIMARY KEY (medicine_id),
    CONSTRAINT report_medicines_report_id_fkey FOREIGN KEY (report_id)
        REFERENCES public.medical_reports (report_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.report_medicines
    OWNER to postgres;


-- Table: public.support_group

-- DROP TABLE IF EXISTS public.support_group;

CREATE TABLE IF NOT EXISTS public.support_group
(
    id integer NOT NULL DEFAULT nextval('support_group_id_seq'::regclass),
    co_id integer,
    group_name text COLLATE pg_catalog."default",
    group_photo text COLLATE pg_catalog."default",
    CONSTRAINT support_group_pkey PRIMARY KEY (id),
    CONSTRAINT support_group_co_id_fkey FOREIGN KEY (co_id)
        REFERENCES public.co_profile (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.support_group
    OWNER to postgres;


-- Table: public.support_group_message

-- DROP TABLE IF EXISTS public.support_group_message;

CREATE TABLE IF NOT EXISTS public.support_group_message
(
    id integer NOT NULL DEFAULT nextval('support_group_message_id_seq'::regclass),
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    message_date date NOT NULL,
    message_time time without time zone NOT NULL,
    CONSTRAINT support_group_message_pkey PRIMARY KEY (id),
    CONSTRAINT support_group_message_group_id_fkey FOREIGN KEY (group_id)
        REFERENCES public.support_group (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT support_group_message_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.support_group_message
    OWNER to postgres;


-- Table: public.support_group_user

-- DROP TABLE IF EXISTS public.support_group_user;

CREATE TABLE IF NOT EXISTS public.support_group_user
(
    id integer NOT NULL DEFAULT nextval('support_group_user_id_seq'::regclass),
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    join_date date NOT NULL,
    CONSTRAINT support_group_user_pkey PRIMARY KEY (id),
    CONSTRAINT support_group_user_group_id_fkey FOREIGN KEY (group_id)
        REFERENCES public.support_group (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT support_group_user_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.support_group_user
    OWNER to postgres;



-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    full_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone_no character varying(13) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    identity_card character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    role character varying(50) COLLATE pg_catalog."default" NOT NULL,
    healthcare_license character varying(50) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    identity_card_image bytea,
    healthcare_license_document bytea,
    community_organizer_document bytea,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_identity_card UNIQUE (identity_card),
    CONSTRAINT users_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

🔐 Authentication

JWT-based authentication is used for securing endpoints.
Add Authorization: Bearer <your_token> in API requests.

📌 Future Enhancements

AI-powered health insights for elderly patients.
Integration with wearable health devices for real-time monitoring.
Telemedicine features for video consultations.

💙 Made with care for elderly well-being.
