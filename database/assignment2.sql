-- 1-3 tony stark query
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n',
        'Admin'
    );
DELETE FROM account
WHERE account_id = 1;
-- 4 GM Hummer
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- 5 inner join
SELECT inv_make,
    inv_model,
    classification_name
FROM inventory
    INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
-- 6 file path update
UPDATE inventory
SET inv_image = REPLACE(
        inv_image,
        'images/',
        'images/vehicles/'
    );
UPDATE inventory
SET inv_thumbnail = REPLACE(
        inv_thumbnail,
        'images/',
        'images/vehicles/'
    );