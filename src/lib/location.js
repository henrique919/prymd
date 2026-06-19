import { newItp } from '../data/itpTemplate.js'
import { uid } from './id.js'

export function locationLabel(location) {
  if (!location) return 'No location selected'
  const parts = [location.building, location.level, location.unit, location.areaName]
    .map((p) => String(p || '').trim())
    .filter(Boolean)
  if (parts.length) return parts.join(' · ')
  return location.name || 'Unnamed location'
}

export function createLocation(data = {}) {
  return {
    id: data.id || uid('loc'),
    name: data.name || '',
    building: data.building || '',
    level: data.level || '',
    unit: data.unit || '',
    areaName: data.areaName || '',
    scheduledDate: data.scheduledDate || '',
    scheduledTime: data.scheduledTime || '',
    assignee: data.assignee || '',
    comments: data.comments || '',
    photos: Array.isArray(data.photos) ? data.photos : [],
    itp: Array.isArray(data.itp) ? data.itp : newItp(),
    createdAt: data.createdAt || new Date().toISOString(),
  }
}
