-- 1) Main tables
create table users
(
    user_id    char(26)
        constraint users_pk primary key,
    email      varchar(64) unique      not null,
    fullname   varchar(50)             not null,
    username   varchar(39) unique      not null,
    password   varchar(1024),
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null,
    last_login timestamp
);

create table projects
(
    project_id  char(26)
        constraint projects_pk primary key,
    -- user currently tackling with a project must not be deleted
    creator_id  char(26)                not null references users (user_id),
    name        varchar(80) unique      not null,
    description text,
    is_public   boolean   default true  not null,
    is_active   boolean   default true  not null,
    created_at  timestamp default now() not null,
    updated_at  timestamp default now() not null
);

create table stories
(
    story_id    char(26)
        constraint stories_pk primary key,
    -- user currently tackling with a story must not be deleted
    creator_id  char(26)                not null references users (user_id),
    project_id  char(26)                not null references projects on delete cascade,
    title       varchar(80)             not null,
    type        varchar(7)              not null check ( type in ('feature', 'bug', 'chore') ),
    points      smallint  default 0     not null,
    description text,
    status      varchar(9)              not null check (status in
                                                        ('unstarted', 'started', 'finished', 'delivered', 'rejected', 'done')),
    created_at  timestamp default now() not null,
    updated_at  timestamp default now() not null
);

-- 2) Bridge tables
create table project_members
(
    project_id char(26)                not null references projects on delete cascade,
    -- members in a project must not be deleted
    user_id    char(26)                not null references users,
    created_at timestamp default now() not null,
    primary key (project_id, user_id)
);

create table story_members
(
    story_id char(26) not null references stories on delete cascade,
    -- user who are currently coping with a story must not be deleted
    user_id  char(26) not null references users,
    primary key (story_id, user_id)
);
