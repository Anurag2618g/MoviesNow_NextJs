#user
-id
-email (unique)
-passwordHash
-role (user ||admin)
-isVerified (boolean)

-createdAt
-updatedAt
-lastLoggedIn

-refreshtoken

---

#content
-id
-tmdbId
-type (tv || movies || series)

-title
-overview
-posterPath
-backdropPath

-releaseADate
-rating
-votes
-genere

-createdAt
-updatedAt

---

#watchHistory
-id
-userId (user ref)
-contentId (content ref)

-progress (time)
-status (completed || pending)
-watchTime

-lastWatchedAt
-createdAt
