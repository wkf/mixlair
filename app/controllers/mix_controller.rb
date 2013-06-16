class MixController < ApplicationController
  before_filter :authenticate_user!

  def create
    @mix = Mix.new
    @mix.user_id = current_user.id

    render json: @mix
  end

  def index
    @mixes = current_user.mixes

    render json: @mixes
  end
end
