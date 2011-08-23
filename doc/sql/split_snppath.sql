-- split objects in 'mapdata_path' to pieces (0.01 map units)

CREATE TABLE mapdata_path_bkp AS SELECT * FROM mapdata_path;

DELETE FROM mapdata_path;
DROP TABLE mapdata_path_split;

CREATE TABLE mapdata_path_split AS (
SELECT ST_Line_Substring(the_geom, 0.01*n/length,
  CASE
    WHEN 0.01*(n+1) < length THEN 0.01*(n+1)/length
    ELSE 1
  END) AS the_geom
FROM
  (SELECT ST_LineMerge(mapdata_path_bkp.the_geom) AS the_geom,
  ST_Length(mapdata_path_bkp.the_geom) As length
  FROM mapdata_path_bkp
  ) AS t
CROSS JOIN generate_series(0,10000) AS n
WHERE n*0.01/length < 1);

INSERT INTO mapdata_path (area_id, "type", note, the_geom) 
  (SELECT '1'::integer, '1'::integer, '', the_geom FROM mapdata_path_split);
