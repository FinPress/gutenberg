# Accessibility

Accessibility documentation for developers working on the Gutenberg Project.

For more information on accessibility and WordPress see the [Make WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/) and the [Accessibility Team section](https://make.wordpress.org/accessibility/).

## Landmark regions
## Landmark Regions

To improve navigation for screen reader users, it is a best practice to include **all content** on a page within appropriate **ARIA landmarks**. This helps users move quickly between major sections of content such as headers, navigation menus, main content, and footers.

Common ARIA landmarks include:

- `role="banner"` – for site headers
- `role="navigation"` – for navigation menus
- `role="main"` – for the main content
- `role="complementary"` – for sidebars or related information
- `role="contentinfo"` – for footers

When using HTML5, many semantic elements automatically define these landmarks:

- `<header>` → `role="banner"`
- `<nav>` → `role="navigation"`
- `<main>` → `role="main"`
- `<aside>` → `role="complementary"`
- `<footer>` → `role="contentinfo"`

> ✅ **Tip**: Always ensure that landmarks are **unique** and used **only once per page** where appropriate (e.g., only one `<main>` element).

To set up navigation between different regions in Gutenberg, refer to the [`navigateRegions` package](/packages/components/src/higher-order/navigate-regions/README.md) for implementation details.

### 📚 Additional Resources

- [General Principles of Landmark Design (W3C)](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/#x4-2-general-principles-of-landmark-design)
- [ARIA Landmarks Examples (W3C)](https://www.w3.org/WAI/ARIA/apg/example-index/landmarks/)
- [HTML5 Elements That Define ARIA Landmarks (W3C)](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/#x4-1-html-sectioning-elements)


