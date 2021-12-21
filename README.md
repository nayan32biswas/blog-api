# Nest Blog Api

## Start Up the project

- `docker-componse up api --build`
- `docker-componse exec api bash`
  - `yarn typeorm:migration:generate <migration-name>` Generate migration file inside *src/migrations/<>.ts*
  - `yarn typeorm:migration:run` Reflact migration on database.

## High level project overview
### User
- User auth(Sign up/in with email), password change, password reset.
- Users should be able to change profiles.

### Post
- Users should be able to create/update/delete posts.
- Own posts lists, published or unpublished.

### Commnet
- User should able to create/update comment.
- Post should be able to delete the comment.
- Child comments should be deleted when parent comment was delete.

### Vote
- Post vote Upvote/Downvote(one time for a user).
- Comment vote Upvote/Downvote(one time for a user).

### Messaging or Calling
- Users should able to send message to any user.
- Users should be able to call(audio/video) other users if he/she is active.


## Reduce to zero down time
- Setup the project so that deploy does not effect on any request.

## Microservice

- Split the project into three part
  1. User
  2. Post, Comment, Vote
  3. Messaging or Calling
