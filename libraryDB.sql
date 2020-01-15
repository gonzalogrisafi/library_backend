create table users
(
    id          SMALLINT        not null AUTO_INCREMENT,
    username    VARCHAR(50)     not null,
    email       VARCHAR(255)    not null,
    password    VARCHAR(100)    not null,
    rol         varchar(5)      not null,
    CONSTRAINT PK__members__END  PRIMARY KEY(id),
    CONSTRAINT UK__email__END    UNIQUE(email)
);

create table books
(
    id          SMALLINT        NOT NULL AUTO_INCREMENT,
    title       VARCHAR(100)    NOT NULL,
    amount      SMALLINT        NOT NULL,
    author      varchar(100)    NULL,
    cover       varchar(50000)    NULL,
    CONSTRAINT  PK__books__END  PRIMARY KEY (id),
    CONSTRAINT  CK__books__id__END  CHECK (id>0)
);

create table loans
(
    id           SMALLINT       NOT NULL AUTO_INCREMENT,
    userId       SMALLINT       NOT NULL,
    bookId       SMALLINT       NOT NULL,
    expiracyDate INTEGER        NOT NULL,
    CONSTRAINT PK__loans__END           PRIMARY KEY(id),
    CONSTRAINT FK__loans__books__END    FOREIGN KEY(bookId) REFERENCES books(id),
    CONSTRAINT FK__loans__users__END    FOREIGN KEY(userId) REFERENCES users(id),
    CONSTRAINT CK__loans__id__END       CHECK(id>0)
);