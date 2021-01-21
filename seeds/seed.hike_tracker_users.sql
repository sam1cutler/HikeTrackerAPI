TRUNCATE
    hike_tracker_hikes,
    hike_tracker_users
    RESTART IDENTITY CASCADE;

INSERT INTO hike_tracker_users
    (email, password)
VALUES
    ('jason@gmail.com', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai'),
    ('johanna@gmail.com', '$2a$12$k2F2.ERE/Pd4J77D.TADeunrmQiLnxXGw2eBdOHVHiIQriGQ/DRdy'),
    ('monty@gmail.com', '$2a$12$w.dXgpN2C/3JtjfKeYLfqus7OKmybMB.EEOBRIAJHIBRHLESpuzEm'),
    ('jeremy@gmail.com', '$2a$12$3m0jbQAs6HH1oZx1.M8NvOTrHk6W1YAvCF8p.wy.htYRCwyUwfW5.'),
    ('margalit@gmail.com', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai');