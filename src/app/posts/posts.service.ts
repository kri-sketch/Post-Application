import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts/')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      imagePath: string;
      _id: string;
      title: string;
      content: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(id: string, title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts/',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
        };
        const id = responseData.post.id;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
  deletePost(postId: any) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: '',
    };
    this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(
      (response) => {
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex((p) => p.id === post.id);
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('PUT request error:', error);
      }
    );
  }
}
