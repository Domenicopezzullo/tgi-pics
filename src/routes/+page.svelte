<script lang="ts">
 let dialog: HTMLDialogElement;
 let imageViewer: HTMLDialogElement;
 let selectedImage = $state<any>(null);
let { data } = $props();

function openDialog() { dialog.showModal(); }
function closeDialog() { dialog.close(); }

function openImageViewer(img: any) {
  selectedImage = img;
  imageViewer.showModal();
}

function closeImageViewer() {
  imageViewer.close();
  selectedImage = null;
}

function handleImageClick(img: any) {
  openImageViewer(img);
}

function handleImageKeydown(event: KeyboardEvent, img: any) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openImageViewer(img);
  }
}

function handleViewerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && imageViewer && imageViewer.open) {
    closeImageViewer();
  }
}

function handleViewerClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeImageViewer();
  }
}
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-light text-gray-800 mb-4 tracking-wide">TGI Stuff</h1>
      <p class="text-gray-600 mb-8 text-lg">Skibidi milkmen</p>
      <button
        class="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
        onclick={openDialog}
      >
        Upload Image
      </button>
    </div>

    <!-- Image Viewer Modal -->
    <dialog
      bind:this={imageViewer}
      class="p-0 w-full h-full max-w-none max-h-none bg-black/90 backdrop:bg-black/70 m-0 top-0 left-0"
      onclick={handleViewerClick}
      onkeydown={handleViewerKeydown}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {#if selectedImage}
        <div class="relative w-full h-full flex items-center justify-center p-4">
          <!-- Close button -->
          <button
            class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-sm"
            onclick={closeImageViewer}
            aria-label="Close image viewer"
          >
            <span class="text-xl">×</span>
          </button>
          
          <!-- Image info -->
          <div class="absolute top-4 left-4 z-10 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <span class="text-sm font-medium">Image #{selectedImage.id}</span>
          </div>
          
          <!-- Full size image -->
          <img
            src={selectedImage.url}
            alt={`Image ${selectedImage.id}`}
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onclick={(e) => e.stopPropagation()}
          />
        </div>
      {/if}
    </dialog>

    <!-- Upload Modal -->
    <dialog
      bind:this={dialog}
      class="rounded-xl shadow-xl w-96 p-0 backdrop:bg-black/40"
      style="margin: auto;"
    >
      <form
        method="post" 
        action="?/uploadImage"
        enctype="multipart/form-data"
        class="bg-white rounded-xl"
      >
        <div class="p-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-medium text-gray-800 mb-2">Upload New Image</h2>
            <p class="text-gray-600 text-sm">Select an image file to add to the gallery</p>
          </div>
          
          <div class="mb-6">
            <label for="image-upload" class="block text-sm font-medium text-gray-700 mb-2">Choose file</label>
            <input 
              id="image-upload"
              type="file" 
              name="image" 
              required 
              accept="image/*"
              class="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer file:font-medium file:transition-colors"
            />
          </div>
          
          <div class="flex justify-end gap-3">
            <button
              type="button" 
              onclick={closeDialog}
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer font-medium"
            >
              Upload
            </button>
          </div>
        </div>
      </form>
    </dialog>

    <!-- Image Grid -->
    {#if data.imgs && data.imgs.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each data.imgs as img}
          <button
            class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all text-left w-full cursor-pointer border border-gray-200 hover:border-gray-300 group"
            onclick={() => handleImageClick(img)}
            onkeydown={(e) => handleImageKeydown(e, img)}
            aria-label={`View image ${img.id}`}
          >
            <div class="w-full h-64 bg-gray-100 relative overflow-hidden">
              <img
                src={img.url}
                alt={`Image ${img.id}`}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500" style="display: none;">
                <div class="text-center">
                  <div class="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-2 mx-auto"></div>
                  <p class="text-sm">Loading...</p>
                </div>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-800">Image #{img.id}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Active</span>
              </div>
              <p class="text-xs text-gray-600 mt-1">Recently uploaded</p>
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="text-center py-20">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-800 mb-2">No images yet</h3>
        <p class="text-gray-600 mb-4">Start building your gallery by uploading your first image</p>
        <button
          class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          onclick={openDialog}
        >
          Get Started
        </button>
      </div>
    {/if}
  </div>
</div>