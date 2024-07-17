// Logo animasyonu
const logoAnimation = () => {
    const logo = document.getElementById('logo-animation');
    // SVG animasyon kodu burada olacak
};

// Sayfa yüklendiğinde logo animasyonunu başlat
window.addEventListener('load', logoAnimation);

// Kaydırma olayını dinle ve yukarı kaydırma butonunu göster/gizle
window.addEventListener('scroll', () => {
    const scrollTopButton = document.getElementById('scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
});

// Yukarı kaydırma butonuna tıklandığında sayfanın en üstüne kaydır
document.getElementById('scroll-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Çerez bildirimi
const cookieConsent = () => {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        cookieBanner.style.display = 'flex';
    }

    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
    });
};

// Sayfa yüklendiğinde çerez bildirimini kontrol et
window.addEventListener('load', cookieConsent);

// Yükleme göstergesi
const loadingOverlay = document.getElementById('loading-overlay');

const showLoading = () => {
    loadingOverlay.style.display = 'flex';
};

const hideLoading = () => {
    loadingOverlay.style.display = 'none';
};

// Örnek: Sayfa yüklenirken yükleme göstergesini göster
window.addEventListener('load', () => {
    showLoading();
    setTimeout(hideLoading, 1000); // Simüle edilmiş yükleme süresi
});

// Sonsuz kaydırma
let page = 1;
const loadMoreButton = document.querySelector('.load-more');
const postsGrid = document.querySelector('.posts-grid');

const loadMorePosts = async () => {
    showLoading();
    try {
        const response = await fetch(`/api/posts?page=${page}`);
        const data = await response.json();
        
        if (data.posts.length > 0) {
            data.posts.forEach(post => {
                const postElement = createPostElement(post);
                postsGrid.appendChild(postElement);
            });
            page++;
        } else {
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        hideLoading();
    }
};

loadMoreButton.addEventListener('click', loadMorePosts);

// Gönderi elementi oluşturma fonksiyonu
const createPostElement = (post) => {
    const article = document.createElement('article');
    article.classList.add('post-card');
    article.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="post-info">
            <h3>${post.title}</h3>
            <p class="excerpt">${post.excerpt}</p>
            <div class="post-meta">
                <span class="author"><i class="fas fa-user"></i> ${post.author}</span>
                <span class="date"><i class="far fa-calendar"></i> ${post.date}</span>
                <span class="read-time"><i class="far fa-clock"></i> ${post.readTime} deqîqe</span>
            </div>
        </div>
    `;
    return article;
};

// Arama işlevselliği
const searchForm = document.querySelector('.search-box');
const searchInput = searchForm.querySelector('input');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        showLoading();
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
            const results = await response.json();
            displaySearchResults(results);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            hideLoading();
        }
    }
});

const displaySearchResults = (results) => {
    // Arama sonuçlarını gösterme mantığı burada olacak
    console.log('Search results:', results);
};

// Kategori filtreleme
const categoryLinks = document.querySelectorAll('.category-card');

categoryLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const category = e.currentTarget.querySelector('h3').textContent;
        showLoading();
        try {
            const response = await fetch(`/api/posts?category=${encodeURIComponent(category)}`);
            const posts = await response.json();
            displayCategoryPosts(posts);
        } catch (error) {
            console.error('Error fetching category posts:', error);
        } finally {
            hideLoading();
        }
    });
});

const displayCategoryPosts = (posts) => {
    // Kategori gönderilerini gösterme mantığı burada olacak
    console.log('Category posts:', posts);
};

// Yorum gönderme
const commentForm = document.querySelector('.comment-form form');

commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(commentForm);
    showLoading();
    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            addCommentToList(result.comment);
            commentForm.reset();
        } else {
            alert('Şîrove nehat şandin. Ji kerema xwe re dîsa biceribînin.');
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
    } finally {
        hideLoading();
    }
});

const addCommentToList = (comment) => {
    const commentList = document.querySelector('.comment-list');
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <img src="${comment.userAvatar}" alt="${comment.userName}" class="user-avatar">
        <div class="comment-content">
            <h4>${comment.userName}</h4>
            <p class="comment-date">${comment.date}</p>
            <p class="comment-text">${comment.text}</p>
        </div>
    `;
    commentList.prepend(commentElement);
};

// Bülten aboneliği
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    showLoading();
    try {
        const response = await fetch('/api/newsletter-signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        if (result.success) {
            alert('Hûn bi serkeftî ji bo bultena me hatin tomarkirin!');
            newsletterForm.reset();
        } else {
            alert('Tomarkirin bi ser neket. Ji kerema xwe re dîsa biceribînin.');
        }
    } catch (error) {
        console.error('Error signing up for newsletter:', error);
    } finally {
        hideLoading();
    }
});

// Okunma süresi hesaplama
const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

// Okunma sayısı güncelleme
const updateReadCount = async (postId) => {
    try {
        await fetch(`/api/posts/${postId}/read`, { method: 'POST' });
    } catch (error) {
        console.error('Error updating read count:', error);
    }
};

// Sosyal medya paylaşım butonları
const setupSocialSharing = () => {
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const network = button.dataset.network;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;

            switch (network) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
                    break;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
};

// Sayfa yüklendiğinde sosyal medya paylaşım butonlarını ayarla
window.addEventListener('load', setupSocialSharing);

// Tema değiştirme
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Sayfa yüklendiğinde tema tercihini kontrol et
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    }
});

// Lazy loading için Intersection Observer
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Sayfa yüklendiğinde lazy loading'i başlat
window.addEventListener('load', lazyLoadImages);
