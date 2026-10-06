// Gallery photos grouped by room.
// Photos live in src/assets/images/gallery/
export const GALLERY_SECTIONS = [
  {
    key: 'living',
    label: 'Living Room',   // small label under the top thumbnail
    title: 'Living room',   // section heading
    images: [
      require('../assets/images/gallery/living1.jpg'),
      require('../assets/images/gallery/living2.jpg'),
      require('../assets/images/gallery/living3.jpg'),
    ],
  },
  {
    key: 'kitchen',
    label: 'Kitchen',
    title: 'Kitchen',
    images: [
      require('../assets/images/gallery/kitchen1.jpg'),
      require('../assets/images/gallery/kitchen2.jpg'),
      require('../assets/images/gallery/kitchen3.jpg'),
      require('../assets/images/gallery/kitchen4.jpg'),
      require('../assets/images/gallery/kitchen5.jpg'),
    ],
  },
  {
    key: 'bedroom',
    label: 'Bedroom',
    title: 'Bedroom',
    images: [
      require('../assets/images/gallery/bedroom1.jpg'),
      require('../assets/images/gallery/bedroom2.jpg'),
      require('../assets/images/gallery/bedroom3.jpg'),
    ],
  },
];

// One flat list for the full screen viewer, with a caption for each photo.
export const GALLERY_PHOTOS = GALLERY_SECTIONS.flatMap((section) =>
  section.images.map((source, i) => ({
    source,
    caption: `${section.label} - ${i + 1}`,
  })),
);
