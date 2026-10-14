import { pathKeyToURL } from '@bagelink/vue'

/**
 * A block's image/media prop, as produced by `$.upload()`.
 *
 * Uploads arrive as either a datastore path key (`stores/…/file.webp`), an
 * absolute URL/public path the editor pasted, or an upload object. Blocks must
 * render all three.
 */
export type MediaProp =
	| string
	| { path_key?: string; url?: string; imageURL?: string }
	| null
	| undefined

const ABSOLUTE_URL = /^(https?:)?\/\/|^\/|^data:|^blob:/

/** Resolve a media prop to a displayable URL ('' when unset). */
export function mediaUrl(prop: MediaProp): string {
	if (!prop) return ''

	if (typeof prop === 'object') {
		return mediaUrl(prop.url ?? prop.imageURL ?? prop.path_key)
	}

	const value = prop.trim()
	if (!value) return ''
	if (ABSOLUTE_URL.test(value)) return value
	return pathKeyToURL(value) ?? value
}

/** True when a link points off-site, so it should render as `href`, not `to`. */
export function isExternalUrl(href?: string | null): boolean {
	return !!href && /^(https?:)?\/\//.test(href)
}

/**
 * Link attributes for a `Btn`: `to` for in-app routes, `href` for off-site
 * links, `{ target: '_blank', rel: 'noopener noreferrer' }` when `newTab`.
 */
export function linkAttrs(
	href?: string | null,
	{ newTab = false }: { newTab?: boolean } = {},
): Record<string, string> {
	if (!href) return {}
	const external = isExternalUrl(href)
	const attrs: Record<string, string> = external ? { href } : { to: href }
	if (external && newTab) {
		attrs.target = '_blank'
		attrs.rel = 'noopener noreferrer'
	}
	return attrs
}
