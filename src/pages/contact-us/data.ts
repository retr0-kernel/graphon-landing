import devOneImage from '../../assets/images/photo2.webp';
import devTwoImage from '../../assets/images/photo1.webp';

export interface DeveloperContact {
  name: string;
  role: string;
  email: string;
  linkedin: string;
  phone: string;
  image: string;
  imageAlt: string;
}

export const CONTACT_PAGE_DATA = {
  eyebrow: 'Contact Us',
  title: 'Talk to the people building Graphon.',
  subtitle:
    'Reach the developers directly for deployment questions, enterprise discussions, support, or collaboration around Kubernetes runtime intelligence.',
  primaryEmail: 'krish22092003@gmail.com',
  primaryEmailLabel: 'Primary contact',
  primaryEmailNote: 'We usually respond with the right developer context.',
  developers: [
    {
      name: 'Krish Srivastava',
      role: 'FullStack/Platform Engineer',
      email: 'krish22092003@gmail.com',
      linkedin: 'https://www.linkedin.com/in/krish-srivastava/',
      phone: '+91 8076001830',
      image: devOneImage,
      imageAlt: 'Developer One profile photo',
    },
    {
      name: 'Aryan Ranjan',
      role: 'FullStack Engineer',
      email: 'aryanempire26@gmail.com',
      linkedin: 'https://www.linkedin.com/in/aryan-ranjan-79634124a/',
      phone: '+91 7764007705',
      image: devTwoImage,
      imageAlt: 'Developer Two profile photo',
    },
  ] satisfies readonly DeveloperContact[],
} as const;

export function getGmailComposeUrl(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}
