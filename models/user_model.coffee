module.exports = (app) ->
  class UserModel extends app.Model
    # 'WIP'

    @collection 'users'
    @schema
      _id:
        id: 'Number'
        provider: 'String'
      provider: 'String'
      handle: 'String'
      name:
        first: 'String'
        last: 'String'
      location: 'String'
      createdAt: 'Date'
      updatedAt: 'Date'

    # create unique index!

    # @validate 'name.first', (firstName) -> firstName.match /name/
    # @validate 'name.last', (lastName) -> lastName.match /name/

    @findOrCreateFromTwitterProfile: (profile) =>
      @findOrCreate
        _id:
          id: profile.id
          provider: profile.provider
        handle: profile.username

    @findOrCreateFromFacebookProfile: (profile) =>
      @findOrCreate
        _id:
          id: profile.id
          provider: profile.provider
        handle: profile.username

