/* 
--DROP TABLE Dates
CREATE TABLE Dates
(
	Id bigint,
    Dt date
);


INSERT INTO Dates (ID, Dt)
VALUES
(1, '2021-01-01'),
(1, '2021-01-10'),
(1, '2021-01-30'),
(2, '2021-01-15'),
(2, '2021-01-30')

*/

SELECT 
	* 
FROM (
	SELECT 
		Id,
		Dt as Sd
		,LEAD(dt) OVER  (PARTITION BY Id ORDER BY dt) as Ed
	FROM Dates
) o
WHERE Ed IS NOT NULL
ORDER BY Id, Sd