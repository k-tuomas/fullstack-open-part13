CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes numeric DEFAULT 0
);

insert into blogs (author, url, title) values ('author1', 'example1.url.fi', 'initial blog1');
insert into blogs (author, url, title) values ('author2', 'example2.url.fi', 'initial blog2');

