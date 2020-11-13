\c nc_news_test

SELECT articles.*, COUNT(comment_id) AS comment_count, COUNT(articles.article_id) AS total_count FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.author = 'rogersop'
GROUP BY articles.article_id
LIMIT 5;