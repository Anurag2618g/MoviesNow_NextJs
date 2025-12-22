#user
-id
-email (unique)
-passwordHash
-role (user ||admin)
-isVerified (boolean)

-createdAt
-updatedAt
-lastLoggedIn

---

#content
-id
-tmdbId
-type (tv || movies)

-title
-overview
-posterPath
-backdropPath

-releaseDate
-tmdbrating
-tmdbvotes
-genres

-createdAt
-updatedAt

---

#watchHistory
-id
-userId (user ref)
-contentId (content ref)

-progress (inseconds)
-status (completed || in_progress)
-totalwatchTime

-lastWatchedAt
-createdAt
