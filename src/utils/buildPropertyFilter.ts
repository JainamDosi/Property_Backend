export function buildPropertyFilter(query: any) {
  const {
    title,
    type,
    minPrice,
    maxPrice,
    state,
    city,
    minArea,
    maxArea,
    bedrooms,
    minBedrooms,
    maxBedrooms,
    bathrooms,
    minBathrooms,
    maxBathrooms,
    amenities,
    furnished,
    availableFrom,
    listedBy,
    tags,
    colorTheme,
    minRating,
    maxRating,
    isVerified,
    listingType,
    createdBy,
    keyword,
  } = query;

  const filter: any = {};

  if (title) filter.title = { $regex: title, $options: 'i' };
  if (type) filter.type = type;
  if (state) filter.state = state;
  if (city) filter.city = city;
  if (furnished) filter.furnished = furnished;
  if (listedBy) filter.listedBy = listedBy;
  if (colorTheme) filter.colorTheme = colorTheme;
  if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
  if (listingType) filter.listingType = listingType;
  if (createdBy) filter.createdBy = createdBy;

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (Object.keys(filter.price).length === 0) delete filter.price;
  }

  // Area range
  if (minArea || maxArea) {
    filter.areaSqFt = {};
    if (minArea) filter.areaSqFt.$gte = Number(minArea);
    if (maxArea) filter.areaSqFt.$lte = Number(maxArea);
    if (Object.keys(filter.areaSqFt).length === 0) delete filter.areaSqFt;
  }

  // Bedrooms
  if (bedrooms) filter.bedrooms = Number(bedrooms);
  if (minBedrooms || maxBedrooms) {
    filter.bedrooms = filter.bedrooms || {};
    if (minBedrooms) filter.bedrooms.$gte = Number(minBedrooms);
    if (maxBedrooms) filter.bedrooms.$lte = Number(maxBedrooms);
  }

  // Bathrooms
  if (bathrooms) filter.bathrooms = Number(bathrooms);
  if (minBathrooms || maxBathrooms) {
    filter.bathrooms = filter.bathrooms || {};
    if (minBathrooms) filter.bathrooms.$gte = Number(minBathrooms);
    if (maxBathrooms) filter.bathrooms.$lte = Number(maxBathrooms);
  }

  // Rating
  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating) filter.rating.$gte = Number(minRating);
    if (maxRating) filter.rating.$lte = Number(maxRating);
    if (Object.keys(filter.rating).length === 0) delete filter.rating;
  }

  // availableFrom (optional: filter by date or range)
  if (availableFrom) filter.availableFrom = availableFrom;

  // Amenities
  if (amenities) {
    let amenitiesArr: string[] = [];
    if (Array.isArray(amenities)) {
      amenitiesArr = amenities;
    } else if (typeof amenities === 'string') {
      amenitiesArr = amenities.includes('|')
        ? amenities.split('|').map((a: string) => a.trim())
        : amenities.split(',').map((a: string) => a.trim());
    }
    if (amenitiesArr.length > 0) {
      filter.amenities = { $all: amenitiesArr };
    }
  }

  // Tags
  if (tags) {
    let tagsArr: string[] = [];
    if (Array.isArray(tags)) {
      tagsArr = tags;
    } else if (typeof tags === 'string') {
      tagsArr = tags.includes('|')
        ? tags.split('|').map((t: string) => t.trim())
        : tags.split(',').map((t: string) => t.trim());
    }
    if (tagsArr.length > 0) {
      filter.tags = { $all: tagsArr };
    }
  }

  // Keyword search (title, city, state, tags)
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { city: { $regex: keyword, $options: 'i' } },
      { state: { $regex: keyword, $options: 'i' } },
      { tags: { $elemMatch: { $regex: keyword, $options: 'i' } } },
    ];
  }

  return filter;
}