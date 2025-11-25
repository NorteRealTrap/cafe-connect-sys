CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

INSERT INTO comments (comment) VALUES ('Primeiro comentário de teste!');
