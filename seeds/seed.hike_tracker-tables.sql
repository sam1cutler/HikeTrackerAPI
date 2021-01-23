BEGIN;

TRUNCATE
    hike_tracker_hikes,
    hike_tracker_users
    RESTART IDENTITY CASCADE;

INSERT INTO hike_tracker_users
    (id, email, password)
VALUES
    (1, 'jason@gmail.com', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai'),
    (2, 'johanna@gmail.com', '$2a$12$k2F2.ERE/Pd4J77D.TADeunrmQiLnxXGw2eBdOHVHiIQriGQ/DRdy'),
    (3, 'monty@gmail.com', '$2a$12$w.dXgpN2C/3JtjfKeYLfqus7OKmybMB.EEOBRIAJHIBRHLESpuzEm'),
    (4, 'jeremy@gmail.com', '$2a$12$3m0jbQAs6HH1oZx1.M8NvOTrHk6W1YAvCF8p.wy.htYRCwyUwfW5.'),
    (5, 'margalit@gmail.com', '$2a$12$RMZQRtib0KWblIizPt5knuudCQ/xJWartO4wr0wVI9dF7P4tgX3ai');
    (6, 'sampleUser@sampleUser.com', '$2a$12$5TCVA2ImpEvi7PDoxBHHb.wCAjdAFPhRGrKjjjoKtNrz.X3lKv.pi');

INSERT INTO hike_tracker_hikes
    (user_id, name, date, distance, time, elevation, rating, steps, weather, notes, reference)
VALUES
    (3, 'Mailbox Peak', '03-Jul-2019', 9.5, 3.5, 3500, 4, 19000, 'Sun', 'Arrived at 8 a.m. and there were still a decent number of spots available. Not too crowded on the way up, but passed a ton of people on the descent. Bluebird skies and amazing visibility from the top.', 'https://www.wta.org/go-hiking/hikes/mailbox-peak'),
    (4, 'Tiger Mountain', '10-Oct-2019', 11.5, 4.5, 2000, 3, 21000, 'Clouds', 'Trail in great condition, views just okay (not great visibility). Felt like we made great time!', 'https://www.wta.org/go-hiking/hikes/klajflkjad'),
    (3, 'Rattlesnake Ledge', '29-Apr-2018', 8.5, 3, 1500, 2, 16000, 'Rain', 'Arrived at 10 a.m. and there were still a decent number of spots available. Not too crowded on the way up, but passed a ton of people on the descent. Bluebird skies and amazing visibility from the top.', 'https://www.wta.org/go-hiking/hikes/blank1'),
    (1, 'Mailbox Peak', '25-Nov-2018', 6.5, 2.5, 3500, 5, 14000, 'Snow', 'Slogged through snow!', 'https://www.wta.org/go-hiking/hikes/blank2'),
    (3, 'Mt Si', '15-Aug-2020', 4, 3.5, 3000, 4, 12000, 'Sun', 'Great views throughout.', 'https://www.wta.org/go-hiking/hikes/blank3'),
    (1, 'Rattlesnake Ledge', '18-Sep-2020', 4.5, 3, 1500, 3, 14000, 'Rain', 'Wet wet wet, but worth it.', 'https://www.wta.org/go-hiking/hikes/blank4'),
    (2, 'Mailbox Peak', '02-May-2019', 9.5, 5.5, 3500, 3, 18000, 'Clouds', 'Not great views, still pleasant.', 'https://www.wta.org/go-hiking/hikes/blank5'),
    (3, 'Tiger Mountain', '07-Jan-2020', 12, 4.5, 2500, 4, 23000, 'Snow', 'Very glad to have packed microspikes for this one.', 'https://www.wta.org/go-hiking/hikes/blank6'),
    (5, 'Mailbox Peak', '10-Sep-2019', 11, 4.5, 3500, 5, 22000, 'Sun', 'Definitely want to try to do this one again with friends.', 'https://www.wta.org/go-hiking/hikes/blank7'),
    (2, 'Wallace Falls', '01-Jun-2020', 9.5, 2.5, 1000, 4, 17000, 'Sun', 'Very pleasant hike.', 'https://www.wta.org/go-hiking/hikes/blank8');
    (6, 'Mailbox Peak', '03-Jul-2019', 9.5, 3.5, 3500, 4, 19000, 'Sun', 'Arrived at 8 a.m. and there were still a decent number of spots available. Not too crowded on the way up, but passed a ton of people on the descent. Bluebird skies and amazing visibility from the top.', 'https://www.wta.org/go-hiking/hikes/mailbox-peak'),
    (6, 'Tiger Mountain', '10-Oct-2019', 11.5, 4.5, 2000, 3, 21000, 'Clouds', 'Trail in great condition, views just okay (not great visibility). Felt like we made great time!', 'https://www.wta.org/go-hiking/hikes/tiger-mountain-trail'),
    (6, 'Rattlesnake Ledge', '29-Apr-2018', 8.5, 3, 1500, 2, 16000, 'Rain', 'Arrived at 10 a.m. and there were still a decent number of spots available. Not too crowded on the way up, but passed a ton of people on the descent. Bluebird skies and amazing visibility from the top.', 'https://www.wta.org/go-hiking/hikes/rattlesnake-ledge'),
    (6, 'Mailbox Peak', '25-Nov-2018', 6.5, 2.5, 3500, 5, 14000, 'Snow', 'Slogged through snow!', 'https://www.wta.org/go-hiking/hikes/mailbox-peak'),
    (6, 'Mt Si', '15-Aug-2020', 4, 3.5, 3000, 4, 12000, 'Sun', 'Great views throughout.', 'https://www.wta.org/go-hiking/hikes/mount-si'),
    (6, 'Rattlesnake Ledge', '18-Sep-2020', 4.5, 3, 1500, 3, 14000, 'Rain', 'Wet wet wet, but worth it.', 'https://www.wta.org/go-hiking/hikes/rattlesnake-ledge'),
    (6, 'Mailbox Peak', '02-May-2019', 9.5, 5.5, 3500, 3, 18000, 'Clouds', 'Not great views, still pleasant.', 'https://www.wta.org/go-hiking/hikes/mailbox-peak'),
    (6, 'Tiger Mountain', '07-Jan-2020', 6, 4.5, 2500, 4, 23000, 'Snow', 'Very glad to have packed microspikes for this one.', 'https://www.wta.org/go-hiking/hikes/tiger-mountain-trail'),
    (6, 'Mailbox Peak', '10-Sep-2019', 11, 4.5, 3500, 5, 22000, 'Sun', 'Definitely want to try to do this one again with friends.', 'https://www.wta.org/go-hiking/hikes/mailbox-peak'),
    (6, 'Wallace Falls', '01-Jun-2020', 9.5, 2.5, 1000, 4, 17000, 'Sun', 'Very pleasant hike.', 'https://www.wta.org/go-hiking/hikes/wallace-falls');

COMMIT;