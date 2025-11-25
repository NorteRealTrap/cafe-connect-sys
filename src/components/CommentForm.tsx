import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Comment {
  id: number;
  comment: string;
  created_at: string;
}

export function CommentForm() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const loadComments = async () => {
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment })
      });
      
      if (!res.ok) throw new Error('Failed to add comment');
      
      toast.success('Comment added');
      setComment('');
      loadComments();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="write a comment" 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <Button type="submit">Submit</Button>
      </form>
      
      <div>
        {comments.map((c) => (
          <div key={c.id}>
            <p>{c.comment}</p>
            <small>{new Date(c.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
