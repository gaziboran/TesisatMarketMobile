exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Sepet öğesi bulunamadı' });
    }

    await cartItem.update({ quantity });
    res.json(cartItem);
  } catch (error) {
    console.error('Sepet güncelleme hatası:', error);
    res.status(500).json({ message: 'Sepet güncellenirken bir hata oluştu' });
  }
}; 