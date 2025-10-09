import Link from 'next/link';
import Image from 'next/image';

interface BlogFooterProps {
  footer: any[];
  description: any[];
}

export default function BlogFooter({ footer, description }: BlogFooterProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `.footer-link { color: #D3D3D3; text-decoration: none; transition: text-decoration 0.2s ease; } .footer-link:hover { text-decoration: underline; } .footer-desktop { display: flex; justify-content: space-between; align-items: center; } .footer-mobile { display: none; } @media (max-width: 768px) { .footer-desktop { display: none; } .footer-mobile { display: block; } }`
      }} />
      <div style={{ backgroundColor: '#0C0C0C' }}>
        <div style={{
          maxWidth: '12000px',
          margin: '0 auto',
          padding: '1rem 5%',
        }}>
          <div className='footer-desktop'>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem'
            }}>
              <Image
                src="/images/logo-default.svg"
                alt="Palace Studio Logo"
                width={160}
                height={46}
                priority={false}
                style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)' }}
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem'
              }}>
                <Link
                  href='/contact'
                  className='footer-link'
                >
                  contact
                </Link>
                <span style={{ color: '#D3D3D3' }}>/</span>
                <Link
                  href='/about'
                  className='footer-link'
                >
                  about
                </Link>
                <span style={{ color: '#D3D3D3' }}>/</span>
                <a
                  href='https://bsky.app/profile/type.tax'
                  className='footer-link'
                >
                  bluesky
                </a>
              </div>
            </div>
            
            <div style={{ 
              color: '#D3D3D3', 
              fontSize: '0.75rem',
              textAlign: 'right'
            }}>
              <p style={{ margin: 0 }}>© 2025 Boundless Palace. All rights reserved.</p>
              <p style={{ margin: 0 }}>Designed with 🍺 in Serbia.</p>
            </div>
          </div>

          <div className='footer-mobile'>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <Image
                src="/images/logo-default.svg"
                alt="Palace Logo"
                width={80}
                height={37}
                priority={false}
                style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)' }}
              />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <Link
                  href='/contact'
                  className='footer-link'
                >
                  contact
                </Link>
                <span style={{ color: '#D3D3D3' }}>/</span>
                <Link
                  href='/about'
                  className='footer-link'
                >
                  about
                </Link>
                <span style={{ color: '#D3D3D3' }}>/</span>
                <a
                  href='https://bsky.app/profile/type.tax'
                  className='footer-link'
                >
                  bluesky
                </a>
              </div>
            </div>
            
            <div style={{ 
              color: '#D3D3D3', 
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0 }}>© 2025 Boundless Palace. All rights reserved.</p>
              <p style={{ margin: 0 }}>Designed with 🍺 in Serbia.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}