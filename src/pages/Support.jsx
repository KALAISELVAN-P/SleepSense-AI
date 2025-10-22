import { useState } from 'react';
import { Mail, MessageCircle, Book, ChevronDown, ChevronUp } from 'lucide-react';

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I connect my ESP32 device?',
      answer: 'Go to Settings > Device Connection and enter your ESP32 device ID. Make sure your device is powered on and connected to WiFi.'
    },
    {
      question: 'Why is my sleep quality score low?',
      answer: 'Sleep quality is calculated based on heart rate variability, SpO₂ levels, motion, and snoring. Factors like stress, caffeine, and irregular sleep schedule can affect your score.'
    },
    {
      question: 'How accurate is the AI sleep analysis?',
      answer: 'Our AI model has 92% accuracy in detecting sleep patterns and disorders. It continuously learns from your data to improve predictions.'
    },
    {
      question: 'Can I export my sleep data?',
      answer: 'Yes, you can generate PDF reports from the Reports page or export raw data in CSV format from your dashboard.'
    },
    {
      question: 'What should I do if apnea is detected?',
      answer: 'If the system detects potential sleep apnea, consult with a healthcare professional for proper diagnosis and treatment options.'
    }
  ];

  const blogPosts = [
    {
      title: 'Understanding Sleep Stages and Their Importance',
      excerpt: 'Learn about REM, deep sleep, and light sleep phases...',
      date: '2024-01-10'
    },
    {
      title: 'How Heart Rate Variability Affects Sleep Quality',
      excerpt: 'Discover the connection between HRV and sleep...',
      date: '2024-01-08'
    },
    {
      title: 'Natural Ways to Improve Deep Sleep',
      excerpt: 'Evidence-based methods to enhance your sleep...',
      date: '2024-01-05'
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="support-page">
      <h1>Support & Community</h1>

      <div className="support-sections">
        <div className="contact-section">
          <div className="section-header">
            <Mail className="icon" />
            <h3>Contact Us</h3>
          </div>
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({...prev, name: e.target.value}))}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm(prev => ({...prev, subject: e.target.value}))}
              required
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              value={contactForm.message}
              onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="faq-section">
          <div className="section-header">
            <MessageCircle className="icon" />
            <h3>Frequently Asked Questions</h3>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  {expandedFaq === index ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="blog-section">
          <div className="section-header">
            <Book className="icon" />
            <h3>Sleep Science Articles</h3>
          </div>
          <div className="blog-posts">
            {blogPosts.map((post, index) => (
              <div key={index} className="blog-post">
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className="post-meta">
                  <span className="post-date">{post.date}</span>
                  <button className="read-more">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="community-section">
          <div className="section-header">
            <MessageCircle className="icon" />
            <h3>Community</h3>
          </div>
          <div className="community-stats">
            <div className="stat">
              <h4>1,247</h4>
              <span>Active Users</span>
            </div>
            <div className="stat">
              <h4>89</h4>
              <span>Sleep Tips Shared</span>
            </div>
            <div className="stat">
              <h4>4.8</h4>
              <span>Average Rating</span>
            </div>
          </div>
          <div className="community-actions">
            <button className="community-btn">Join Discussion Forum</button>
            <button className="community-btn">Share Your Sleep Story</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;