class MixController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json, :html

  def create
    mix = Mix.new
    mix.user_id = current_user.id

    render json: mix
  end

  def show
    if @mix = current_user.mixes.find_by_id(params[:id])
      @mix
    else
      flash[:notice] = "no mix found with an id of #{params[:id]}"
      redirect_to mix_index_path
    end
  end

  def new
    mix = Mix.new
    mix.user_id = current_user.id

    if mix.save()
      redirect_to mix
    else
      flash[:notice] = "error creating new mix"
      redirect_to mix_index_path
    end
  end

  def index
    @mixes = current_user.mixes

    respond_with @mixes
  end
end
