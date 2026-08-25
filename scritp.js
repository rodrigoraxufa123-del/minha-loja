document.getElementById('searchInput').addEventListener('keyup', function(e) {
  const term = e.target.value.toLowerCase();
  const posts = document.querySelectorAll('.card');

  posts.forEach(post => {
    const title = post.querySelector('h2').textContent.toLowerCase();
    const content = post.querySelector('p:not(.date)').textContent.toLowerCase();

    if (title.includes(term) || content.includes(term)) {
      post.style.display = 'block';
    } else {
      post.style.display = 'none';
    }
  });
});
