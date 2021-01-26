enum EShippingPlace {
  HOME = 'home',
  OFFICE = 'office',
}

enum EOrderSource {
  WEBSITE = 'website',
  FACEBOOK = 'facebook',
  NOW = 'now',
  BAEMIN = 'baemin',
  GOJECK = 'gojeck',
  GRAB = 'grab',
  POS = 'pos',
}

enum EResourceStatus {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

enum EPaymentType {
  COD = 'COD',
  BANKING = 'banking',
}
enum EProductSugarOpt {
  NATURAL,
  SUGAR_5ML,
  SUGAR_10ML,
}

export { EShippingPlace, EOrderSource, EResourceStatus, EPaymentType, EProductSugarOpt };
