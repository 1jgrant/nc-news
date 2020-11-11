\c nc_news_test

-- SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY articles.article_id
BEGIN t
SELECT articles.* FROM articles WITH (UPDLOCK)
WHERE article_id = 1
UPDATE articles SET votes = votes + 1
WHERE article_id = 1
COMMIT t
-- UPDATE articles
-- SET votes = votes + 1
-- WHERE article_id = 1;

-- SELECT articles.* FROM articles 
-- WHERE article_id = 1;