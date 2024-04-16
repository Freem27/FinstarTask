/*
--DROP TABLE Clients
CREATE TABLE Clients
(
    Id BIGINT PRIMARY KEY,
    ClientName NVARCHAR(200)
);

INSERT INTO Clients (Id, ClientName) 
VALUES 
(1, 'Vasya'), (2, 'Yulia'), (3, 'Anigilator')

--DROP TABLE ClientContacts
CREATE TABLE ClientContacts
(
    Id  BIGINT PRIMARY KEY IDENTITY,
    ClientId BIGINT REFERENCES Clients(Id),
    ContactType NVARCHAR(255),
    ContactValue NVARCHAR(255)
);
INSERT INTO ClientContacts (ClientId, ContactType, ContactValue)
VALUES
(1, 'vv',  'Vasya contact 1'),
(1, 'vv',  'Vasya contact 2'),
(1, 'vv2', 'Vasya contact 3'),

(2, 'yy', 'Yulia contact 1'),
(2, 'yy', 'Yulia contact 2')
*/

--TASK 2.1 Написать запрос, который возвращает наименование клиентов и кол-во контактов клиентов
SELECT 
	c.ClientName,
	COUNT(cc.id) AS contacts_count 
FROM Clients c
LEFT JOIN ClientContacts cc ON c.Id = cc.ClientId
GROUP BY c.ClientName


--TASK 2.2 Написать запрос, который возвращает список клиентов, у которых есть более 2 контактов
SELECT 
	c.* 
FROM Clients c
JOIN ClientContacts cc on c.Id = cc.ClientId
GROUP BY c.id, c.ClientName
HAVING COUNT(cc.id) > 2
