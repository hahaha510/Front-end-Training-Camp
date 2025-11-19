// 项目详情展开/折叠功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有展开按钮
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 获取目标元素ID
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 切换显示/隐藏状态
                if (targetElement.style.display === 'none' || !targetElement.style.display) {
                    targetElement.style.display = 'block';
                    this.textContent = '收起详情';
                    this.style.background = '#e74c3c';
                } else {
                    targetElement.style.display = 'none';
                    this.textContent = '展开详情';
                    this.style.background = '#3498db';
                }
            }
        });
    });

    // 导航栏平滑滚动和高亮功能
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .header');
    
    // 点击导航链接平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 移除所有active类
                navLinks.forEach(nav => nav.classList.remove('active'));
                // 给当前点击的链接添加active类
                this.classList.add('active');
                
                // 平滑滚动到目标
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 监听滚动，自动高亮对应的导航项
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px'
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 添加打印功能（可选）
    const printResume = () => {
        window.print();
    };

    // 添加页面加载动画
    const animationSections = document.querySelectorAll('.section');
    const animationObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                animationObserver.unobserve(entry.target);
            }
        });
    }, animationObserverOptions);

    animationSections.forEach(section => {
        animationObserver.observe(section);
    });

    // 检测图片加载失败，使用默认占位符
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.addEventListener('error', function() {
            this.style.display = 'none';
        });
    }

    // 添加简单的性能监控
    if (window.performance) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('页面加载时间:', pageLoadTime + 'ms');
        });
    }
});
